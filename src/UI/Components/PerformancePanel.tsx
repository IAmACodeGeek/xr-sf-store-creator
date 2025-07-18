import React, { useState, useEffect } from 'react';
import { useComponentStore, useEnvProductStore, useEnvAssetStore, useEnvironmentStore } from '@/stores/ZustandStores';
import Product from '@/Types/Product';
import styles from './PerformancePanel.module.scss';
import BoltIcon from '@mui/icons-material/Bolt';
import SpeedIcon from '@mui/icons-material/Speed';
import BarChartIcon from '@mui/icons-material/BarChart';
import CloseIcon from '@mui/icons-material/Close';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import LinearProgress from '@mui/material/LinearProgress';
import environmentData from '@/data/environment/EnvironmentData';

interface ProductMetrics {
  id: number;
  title: string;
  fileSize: number;
  type: 'PHOTO' | 'MODEL_3D';
  inEnvironment: boolean;
}

interface AssetMetrics {
  id: string;
  name: string;
  fileSize: number;
  type: 'PHOTO' | 'MODEL_3D';
  source: 'LIBRARY' | 'OWN';
  inEnvironment: boolean;
}

interface PerformanceMetrics {
  shopifyProductsSize: number;
  shopifyProductsCount: number;
  environmentProductsCount: number;
  environmentProductsSize: number;
  environmentAssetsCount: number;
  environmentAssetsSize: number;
  totalSize: number;
  totalEnvironmentSize: number;
  productBreakdown: ProductMetrics[];
  assetBreakdown: AssetMetrics[];
}

const PerformancePanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showAssetDetails, setShowAssetDetails] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    shopifyProductsSize: 0,
    shopifyProductsCount: 0,
    environmentProductsCount: 0,
    environmentProductsSize: 0,
    environmentAssetsCount: 0,
    environmentAssetsSize: 0,
    totalSize: 0,
    totalEnvironmentSize: 0,
    productBreakdown: [],
    assetBreakdown: []
  });

  const { products, toggleAdvancedPerf } = useComponentStore();
  const { envProducts } = useEnvProductStore();
  const { envAssets } = useEnvAssetStore();
  const { environmentType } = useEnvironmentStore();
  const maxThresholdBytes = environmentData[environmentType || '']?.maxThreshold || 30 * 1024 * 1024;
  const percentageUsed = Math.min((metrics.totalEnvironmentSize / maxThresholdBytes) * 100, 100);

  useEffect(() => {
    // Debug logging
    console.log('=== Performance Panel Debug ===');
    console.log('Products:', products.length);
    console.log('EnvProducts:', Object.keys(envProducts).length);
    console.log('EnvAssets:', Object.keys(envAssets).length);
    
    // Debug asset file sizes
    console.log('Asset Details:');
    Object.values(envAssets).forEach(asset => {
      console.log(`Asset ${asset.name}:`, {
        id: asset.id,
        type: asset.type,
        source: asset.source,
        filesize: asset.filesize,
        isEnvironmentAsset: asset.isEnvironmentAsset
      });
    });

    // Helper function to calculate actual file size based on product type and selection
    const calculateProductFileSize = (product: Product, envProduct: any): number => {
      if (!envProduct?.isEnvironmentProduct) return 0;
      
      const type = envProduct.type || 'PHOTO';
      
      if (type === 'PHOTO') {
        // Calculate size of selected image
        const imageIndex = envProduct.imageIndex || 0;
        if (product.images && product.images[imageIndex]) {
          return product.images[imageIndex].size || 0;
        }
        return 0;
      } else if (type === 'MODEL_3D') {
        // Calculate size of selected model
        const modelIndex = envProduct.modelIndex || 0;
        if (product.models && product.models[modelIndex]) {
          const model = product.models[modelIndex];
          
          // First try to get filesize from sources (for regular products)
          if (model.sources && model.sources.length > 0) {
            const sourceFilesize = model.sources[0].filesize;
            if (sourceFilesize && sourceFilesize > 0) {
              return sourceFilesize;
            }
          }
          
          // Fallback to model's filesize property (for asset library products)
          if (model.filesize && model.filesize > 0) {
            return model.filesize;
          }
          
          // If no filesize available, estimate based on model type
          // This is a fallback for asset library items that don't have filesize data
          if (model.sources && model.sources.length > 0) {
            // Estimate size based on URL or format
            const source = model.sources[0];
            if (source.format === 'glb') {
              // Estimate GLB file size (typically 1-10 MB for furniture models)
              return 2 * 1024 * 1024; // 2MB estimate
            }
          }
        }
        return 0;
      }
      
      return 0;
    };

    // Calculate product metrics with dynamic file sizes
    const productBreakdown: ProductMetrics[] = products.map(product => {
      const envProduct = envProducts[product.id];
      const actualFileSize = calculateProductFileSize(product, envProduct);
      
      return {
        id: product.id,
        title: product.title,
        fileSize: actualFileSize,
        type: envProduct?.type || 'PHOTO',
        inEnvironment: envProduct?.isEnvironmentProduct || false
      };
    });

    // Calculate asset metrics with file size
    const assetBreakdown: AssetMetrics[] = Object.values(envAssets).map(asset => {
      const fileSize = asset.filesize || 0;
      console.log(`Asset ${asset.name} filesize:`, fileSize);
      
      return {
        id: asset.id,
        name: asset.name,
        fileSize: fileSize,
        type: asset.type,
        source: asset.source,
        inEnvironment: asset.isEnvironmentAsset || false
      };
    });

    // Calculate totals with dynamic sizing
    const shopifyProductsSize = products.reduce((total, product: Product) => {
      return total + (product.totalFileSize || 0);
    }, 0);

    const environmentProducts = Object.values(envProducts).filter(p => p.isEnvironmentProduct);
    const environmentProductsSize = environmentProducts.reduce((total, envProduct) => {
      const product = products.find(p => p.id === envProduct.id);
      if (!product) return total;
      
      return total + calculateProductFileSize(product, envProduct);
    }, 0);

    const environmentAssets = Object.values(envAssets).filter(a => a.isEnvironmentAsset);
    const environmentAssetsSize = environmentAssets.reduce((total, asset) => {
      const assetSize = asset.filesize || 0;
      console.log(`Environment asset ${asset.name} size:`, assetSize);
      return total + assetSize;
    }, 0);

    console.log('Calculated sizes:');
    console.log('- Environment Products Size:', environmentProductsSize);
    console.log('- Environment Assets Size:', environmentAssetsSize);
    console.log('- Total Environment Size:', environmentProductsSize + environmentAssetsSize);

    const shopifyProductsCount = products.length;
    const environmentProductsCount = environmentProducts.length;
    const environmentAssetsCount = environmentAssets.length;
    const totalSize = shopifyProductsSize;
    const totalEnvironmentSize = environmentProductsSize + environmentAssetsSize;

    setMetrics({
      shopifyProductsSize,
      shopifyProductsCount,
      environmentProductsCount,
      environmentProductsSize,
      environmentAssetsCount,
      environmentAssetsSize,
      totalSize,
      totalEnvironmentSize,
      productBreakdown,
      assetBreakdown
    });
  }, [products, envProducts, envAssets]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPerformanceLevel = (): { level: string; color: string } => {
    const totalMB = metrics.totalEnvironmentSize / (1024 * 1024);
    if (totalMB < 5) return { level: 'Excellent', color: '#22c55e' };
    if (totalMB < 15) return { level: 'Good', color: '#eab308' };
    if (totalMB < 30) return { level: 'Fair', color: '#f97316' };
    return { level: 'Poor', color: '#ef4444' };
  };

  const performanceInfo = getPerformanceLevel();

  const handleIndicatorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={styles.performancePanel}>
      <div className={styles.performanceControls}>
        <div 
          className={styles.indicator}
          onClick={handleIndicatorClick}
          onKeyDown={handleKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          role="button"
          tabIndex={0}
          aria-label="Performance Monitor"
          aria-expanded={isExpanded}
          title="Click to view detailed performance metrics"
          style={{
            cursor: 'pointer',
            touchAction: 'manipulation'
          }}
        >
          <div className={styles.iconContainer}><BoltIcon fontSize="small" /></div>
          <span className={styles.indicatorText}>
            {formatFileSize(metrics.totalEnvironmentSize)}
          </span>
        </div>
        
        <button 
          className={styles.advancedButton}
          onClick={toggleAdvancedPerf}
          title="Toggle R3F Performance Monitor"
        >
          <BarChartIcon fontSize="small" />
        </button>
      </div>

      {isExpanded && (
        <div className={styles.expandedPanel}>
          <div className={styles.header}>
            <h3>Performance Monitor</h3>
            <div className={styles.headerButtons}>
              <button 
                className={styles.closeButton}
                onClick={() => setIsExpanded(false)}
                title="Close"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
          </div>
          
          <div className={styles.metrics}>
            {/* Performance Overview */}
            <div className={styles.section}>
              <div className={styles.metricRow}>
                <span className={styles.label}>Performance Level:</span>
                <span 
                  className={styles.value}
                  style={{ color: performanceInfo.color }}
                >
                  {performanceInfo.level}
                </span>
              </div>
              
              <div className={styles.metricRow}>
                <span className={styles.label}>Environment Usage:</span>
                <span className={styles.value}>{formatFileSize(metrics.totalEnvironmentSize)}</span>
              </div>
              
              <div className={styles.metricRow}>
                <span className={styles.label}>Total Available:</span>
                <span className={styles.value}>{formatFileSize(maxThresholdBytes)}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'8px'}}>
                <LinearProgress variant="determinate" value={percentageUsed} sx={{flex:1, height:8, borderRadius:4, backgroundColor:'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar':{backgroundColor:'#f97316'}}} />
                <span className={styles.value}>{Math.round(percentageUsed)}%</span>
              </div>
            </div>

            <div className={styles.separator}></div>
            
            {/* Environment Stats */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Environment Overview</h4>
              
              <div className={styles.metricRow}>
                <span className={styles.label}>Active Products:</span>
                <span className={styles.value}>
                  {metrics.environmentProductsCount} of {metrics.shopifyProductsCount} ({formatFileSize(metrics.environmentProductsSize)})
                </span>
              </div>
              
              <div className={styles.metricRow}>
                <span className={styles.label}>Active Assets:</span>
                <span className={styles.value}>
                  {metrics.environmentAssetsCount} items ({formatFileSize(metrics.environmentAssetsSize)})
                </span>
              </div>
            </div>

            <div className={styles.separator}></div>

            {/* Product Breakdown */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>Products ({metrics.shopifyProductsCount})</h4>
                <button 
                  className={styles.toggleButton}
                  onClick={() => setShowProductDetails(!showProductDetails)}
                  title={showProductDetails ? 'Collapse' : 'Expand'}
                >
                  {showProductDetails ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </button>
              </div>
              
              {showProductDetails && (
                <div className={styles.breakdown}>
                  {metrics.productBreakdown.map((product) => (
                    <div key={product.id} className={`${styles.breakdownItem} ${product.inEnvironment ? styles.active : ''}`}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{product.title}</span>
                        <span className={styles.itemType}>{product.type}</span>
                      </div>
                      <div className={styles.itemStats}>
                        <span className={styles.itemSize}>{formatFileSize(product.fileSize)}</span>
                        {product.inEnvironment && <span className={styles.activeIndicator}>🔴</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.separator}></div>

            {/* Asset Breakdown */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>Assets ({metrics.assetBreakdown.length})</h4>
                <button 
                  className={styles.toggleButton}
                  onClick={() => setShowAssetDetails(!showAssetDetails)}
                  title={showAssetDetails ? 'Collapse' : 'Expand'}
                >
                  {showAssetDetails ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </button>
              </div>
              
              {showAssetDetails && (
                <div className={styles.breakdown}>
                  {metrics.assetBreakdown.map((asset) => (
                    <div key={asset.id} className={`${styles.breakdownItem} ${asset.inEnvironment ? styles.active : ''}`}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{asset.name}</span>
                        <span className={styles.itemType}>{asset.source} • {asset.type}</span>
                      </div>
                      <div className={styles.itemStats}>
                        <span className={styles.itemSize}>{formatFileSize(asset.fileSize)}</span>
                        {asset.inEnvironment && <span className={styles.activeIndicator}>🔴</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={styles.separator}></div>

            {/* Recommendations */}
            <div className={styles.recommendations}>
              <h4>Performance Tips</h4>
              <ul>
                {(() => {
                  const recommendations = [];
                  
                  if (metrics.totalEnvironmentSize > 30 * 1024 * 1024) {
                    recommendations.push(<li key="high-usage">Consider removing some products from environment</li>);
                  }
                  if (metrics.environmentProductsCount > 20) {
                    recommendations.push(<li key="high-product-count">High product count may impact performance</li>);
                  }
                  if (metrics.totalEnvironmentSize > 50 * 1024 * 1024) {
                    recommendations.push(<li key="critical-usage">⚠️ Critical: Very high environment usage detected</li>);
                  }
                  if (metrics.totalEnvironmentSize < 5 * 1024 * 1024) {
                    recommendations.push(<li key="excellent-performance">✅ Excellent performance - optimal environment usage</li>);
                  }
                  if (metrics.environmentAssetsCount > 10) {
                    recommendations.push(<li key="consolidate-assets">Consider consolidating assets for better performance</li>);
                  }
                  if (metrics.environmentProductsCount >= 5 && metrics.totalEnvironmentSize > 25 * 1024 * 1024) {
                    recommendations.push(<li key="large-models">💡 Tip: Large 3D models consume significant space</li>);
                  }
                  if (percentageUsed > 90) {
                    recommendations.push(<li key="high-percentage">⚠️ Warning: Environment usage is very high ({Math.round(percentageUsed)}%)</li>);
                  }
                  
                  // Show default tips only if no specific recommendations
                  if (recommendations.length === 0) {
                    recommendations.push(
                      <li key="default-1">💡 Use 3D models sparingly, they consume more space</li>,
                      <li key="default-2">💡 Remove unused products and assets to free up space</li>
                    );
                  }
                  
                  return recommendations;
                })()}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformancePanel; 