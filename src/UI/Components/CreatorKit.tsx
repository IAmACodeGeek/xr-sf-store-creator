import React, { useCallback, useMemo, useRef, useState, memo } from "react";
import {
  Box,
  Button,
  Checkbox,
  Typography,
  Slider,
  styled,
  Chip,
} from "@mui/material";
import {
  EnvProduct,
  useComponentStore,
  useEnvProductStore,
  useToolStore,
  useEnvAssetStore,
  EnvAsset,
  useBrandStore,
} from "../../stores/ZustandStores";
import { ModelViewer } from "@shopify/hydrogen-react";
import Product from "@/Types/Product";
import Swal from "sweetalert2";
import styles from "../UI.module.scss";
import { useGLTF } from "@react-three/drei";
import environmentData from "@/data/environment/EnvironmentData";
import {
  ALLOWED_MIME_TYPES,
  AssetService,
  ERROR_CODES,
} from "@/api/assetService";
import EnvStoreService from "@/api/envStoreService";
import { showPremiumPopup } from "./PremiumRequired";
import {
  Upload,
  Trash2,
  Save,
  Image as ImageIcon,
  Box as BoxIcon,
  Settings,
  Layers,
  Move3D,
  RotateCcw,
  ZoomIn,
  Check,
} from "lucide-react";
import PlaceHolderData from "@/data/environment/placeHolderData/PlaceHolderData";

// Glassmorphism styled components
const GlassBox = styled(Box)(() => ({
  background: "rgba(15, 15, 25, 0.85)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  padding: "20px",
  "&:hover": {
    background: "rgba(20, 20, 30, 0.9)",
    borderColor: "rgba(77, 177, 255, 0.3)",
    transform: "translateY(-2px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
  },
}));

const GlassButton = styled(Button)<{ isPrimary?: boolean }>(
  ({ isPrimary }) => ({
    borderRadius: "12px",
    textTransform: "none",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    padding: "12px 24px",
    minHeight: "48px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(12px)",
    border: isPrimary
      ? "1px solid rgba(241, 39, 17, 0.5)"
      : "1px solid rgba(245, 175, 25, 0.4)",
    ...(isPrimary
      ? {
          background: "linear-gradient(135deg, #f12711, #f5af19)",
          color: "white",
          "&:hover": {
            background: "linear-gradient(135deg, #FF4E33, #FFC13B)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 24px rgba(241, 39, 17, 0.4)",
          },
        }
      : {
          background: "rgba(245, 175, 25, 0.1)",
          color: "rgba(245, 175, 25, 0.9)",
          "&:hover": {
            background: "rgba(245, 175, 25, 0.25)",
            color: "white",
            transform: "translateY(-1px)",
          },
        }),
  })
);

const GlassSlider = styled(Slider)(() => ({
  color: "rgba(245, 175, 25, 0.9)",
  height: 6,
  padding: "15px 0",
  "& .MuiSlider-track": {
    background: "linear-gradient(90deg, #f12711, #f5af19)",
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    border: "2px solid rgba(245, 175, 25, 0.8)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      boxShadow: "0 8px 20px rgba(245, 175, 25, 0.6)",
      borderColor: "rgba(245, 175, 25, 1)",
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
    "&.Mui-active": {
      boxShadow: "0 10px 24px rgba(245, 175, 25, 0.8)",
      borderColor: "rgba(245, 175, 25, 1)",
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
  },
  "& .MuiSlider-rail": {
    color: "rgba(255, 255, 255, 0.1)",
    opacity: 1,
  },
}));

const AnimatedChip = styled(Chip)(() => ({
  background: "rgba(15, 15, 25, 0.8)",
  color: "white",
  border: "1px solid rgba(245, 175, 25, 0.4)",
  borderRadius: "20px",
  fontFamily: "'Poppins', sans-serif",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "24px",
  fontSize: "0.8125rem",
  minWidth: "55px",
  "& .MuiChip-labelSmall": {
    paddingLeft: "8px",
    paddingRight: "8px",
    lineHeight: "24px",
    display: "flex",
    justifyContent: "center",
  },
  "&:hover": {
    background: "rgba(245, 175, 25, 0.25)",
    borderColor: "rgba(245, 175, 25, 0.6)",
    transform: "scale(1.05)",
  },
}));

// Memoized components to prevent unnecessary rerenders
const EntityTypeSelector = memo(
  ({
    entityType,
    onEntityTypeChange,
  }: {
    entityType: "PRODUCT" | "ASSET";
    onEntityTypeChange: (type: "PRODUCT" | "ASSET") => void;
  }) => {
    return (
      <GlassBox sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <GlassButton
            isPrimary={entityType === "PRODUCT"}
            onClick={() => onEntityTypeChange("PRODUCT")}
            startIcon={<Layers size={18} />}
            fullWidth
          >
            Products
          </GlassButton>
          <GlassButton
            isPrimary={entityType === "ASSET"}
            onClick={() => onEntityTypeChange("ASSET")}
            startIcon={<BoxIcon size={18} />}
            fullWidth
          >
            Assets
          </GlassButton>
        </Box>
      </GlassBox>
    );
  }
);

const MediaTypeSelector = memo(
  ({
    mediaType,
    onMediaTypeChange,
  }: {
    mediaType: "PHOTO" | "MODEL_3D";
    onMediaTypeChange: (type: "PHOTO" | "MODEL_3D") => void;
  }) => {
    return (
      <GlassBox sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <GlassButton
            isPrimary={mediaType === "PHOTO"}
            onClick={() => onMediaTypeChange("PHOTO")}
            startIcon={<ImageIcon size={18} />}
            fullWidth
          >
            2D Images
          </GlassButton>
          <GlassButton
            isPrimary={mediaType === "MODEL_3D"}
            onClick={() => onMediaTypeChange("MODEL_3D")}
            startIcon={<BoxIcon size={18} />}
            fullWidth
          >
            3D Models
          </GlassButton>
        </Box>
      </GlassBox>
    );
  }
);

const ParamsTypeSelector = memo(
  ({
    paramsType,
    onParamsTypeChange,
  }: {
    paramsType: "CUSTOM" | "PLACEHOLDER";
    onParamsTypeChange: (type: "CUSTOM" | "PLACEHOLDER") => void;
  }) => {
    return (
      <GlassBox sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <GlassButton
            isPrimary={paramsType === "CUSTOM"}
            onClick={() => onParamsTypeChange("CUSTOM")}
            startIcon={<Settings size={18} />}
            fullWidth
          >
            Custom
          </GlassButton>
          <GlassButton
            isPrimary={paramsType === "PLACEHOLDER"}
            onClick={() => onParamsTypeChange("PLACEHOLDER")}
            startIcon={<Layers size={18} />}
            fullWidth
          >
            Placeholder
          </GlassButton>
        </Box>
      </GlassBox>
    );
  }
);

const SliderControl = memo(
  ({
    label,
    value,
    onChange,
    min = -10,
    max = 10,
    step = 0.1,
    icon: Icon,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    icon?: React.ComponentType<{
      size?: number | string;
      style?: React.CSSProperties;
    }>;
  }) => {
    const handleChange = useCallback(
      (_event: Event, newValue: number | number[]) => {
        onChange(typeof newValue === "number" ? newValue : newValue[0]);
      },
      [onChange]
    );

    return (
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            height: "24px",
          }}
        >
          {/* Group 1: Icon and Label */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              height: "24px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                visibility: Icon ? "visible" : "hidden",
              }}
            >
              {Icon && <Icon size={16} />}
            </Box>
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: "white",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "24px",
              }}
            >
              {label}
            </Typography>
          </Box>
          {/* Group 2: Chip */}
          <AnimatedChip label={value.toFixed(2)} size="small" />
        </Box>
        <GlassSlider
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          valueLabelDisplay="off"
        />
      </Box>
    );
  }
);

const Vector3Control = memo(
  ({
    label,
    value,
    onChange,
    min = -10,
    max = 10,
    step = 0.1,
    icon: Icon,
  }: {
    label: string;
    value: [number, number, number];
    onChange: (value: [number, number, number]) => void;
    min?: number;
    max?: number;
    step?: number;
    icon?: React.ComponentType<{ size?: number | string }>;
  }) => {
    const handleXChange = useCallback(
      (newValue: number) => {
        onChange([newValue, value[1], value[2]]);
      },
      [value, onChange]
    );

    const handleYChange = useCallback(
      (newValue: number) => {
        onChange([value[0], newValue, value[2]]);
      },
      [value, onChange]
    );

    const handleZChange = useCallback(
      (newValue: number) => {
        onChange([value[0], value[1], newValue]);
      },
      [value, onChange]
    );

    return (
      <GlassBox sx={{ mb: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            gap: 1,
            height: "28px",
          }}
        >
          {Icon && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "28px",
                width: "28px",
              }}
            >
              <Icon size={18} />
            </Box>
          )}
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "28px",
            }}
          >
            {label}
          </Typography>
        </Box>
        <SliderControl
          label="X"
          value={value[0]}
          onChange={handleXChange}
          min={min}
          max={max}
          step={step}
          icon={Icon}
        />
        <SliderControl
          label="Y"
          value={value[1]}
          onChange={handleYChange}
          min={min}
          max={max}
          step={step}
          icon={Icon}
        />
        <SliderControl
          label="Z"
          value={value[2]}
          onChange={handleZChange}
          min={min}
          max={max}
          step={step}
          icon={Icon}
        />
      </GlassBox>
    );
  }
);

const FaceSelector = memo(
  ({
    value,
    onChange,
  }: {
    value?: "N" | "S" | "E" | "W";
    onChange: (value: "N" | "S" | "E" | "W") => void;
  }) => {
    const faceOptions = [
      { label: "North", value: "N" as const },
      { label: "South", value: "S" as const },
      { label: "East", value: "E" as const },
      { label: "West", value: "W" as const },
    ];

    return (
      <GlassBox sx={{ mb: 2.5 }}>
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            color: "white",
            fontSize: "16px",
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          Player Face Direction
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "12px",
            mb: 1.5,
          }}
        >
          Direction player faces when placing the object
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {faceOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={value === opt.value ? "contained" : "outlined"}
              onClick={() => onChange(opt.value)}
              sx={{
                minWidth: "60px",
                color: "white",
                background:
                  value === opt.value
                    ? "linear-gradient(135deg, #f12711, #f5af19)"
                    : "rgba(245, 175, 25, 0.1)",
                border:
                  value === opt.value
                    ? "none"
                    : "2px solid rgba(245, 175, 25, 0.7)",
                borderRadius: 2,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                "&:hover": {
                  background:
                    value === opt.value
                      ? "linear-gradient(135deg, #f12711, #f5af19)"
                      : "rgba(245, 175, 25, 0.3)",
                },
              }}
            >
              {opt.label}
            </Button>
          ))}
        </Box>
      </GlassBox>
    );
  }
);

// File Upload Component
const FileUploadArea = memo(
  ({ onUpload }: { onUpload: (files: File[]) => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleClick = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    const handleDragEnter = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(true);
      },
      []
    );

    const handleDragLeave = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
      },
      []
    );

    const handleDragOver = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
      },
      []
    );

    const handleDrop = useCallback(
      async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);

        const droppedFiles = Array.from(event.dataTransfer.files || []);
        const validFiles = droppedFiles.filter(
          (file: File) =>
            ALLOWED_MIME_TYPES.includes(file.type) || file.name.endsWith(".glb")
        );

        if (validFiles.length !== droppedFiles.length) {
          console.error("Invalid Files Present");
          return;
        }

        onUpload(validFiles);
      },
      [onUpload]
    );

    const handleFileChange = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        const validFiles = selectedFiles.filter(
          (file: File) =>
            ALLOWED_MIME_TYPES.includes(file.type) || file.name.endsWith(".glb")
        );

        if (validFiles.length !== selectedFiles.length) {
          console.error("Invalid Files Present");
          return;
        }

        onUpload(validFiles);

        // Clear the input value to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      [onUpload]
    );

    return (
      <GlassBox sx={{ p: 3, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            border: isDragOver
              ? "2px dashed rgba(245, 175, 25, 0.8)"
              : "2px dashed rgba(245, 175, 25, 0.4)",
            borderRadius: "12px",
            background: isDragOver ? "rgba(245, 175, 25, 0.1)" : "transparent",
            transition: "all 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              borderColor: "rgba(245, 175, 25, 0.6)",
              background: "rgba(245, 175, 25, 0.05)",
            },
          }}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={ALLOWED_MIME_TYPES.join(",") + ",.glb"}
            multiple
            style={{ display: "none" }}
          />
          <Upload size={48} color="rgba(245, 175, 25, 0.8)" />
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "rgba(245, 175, 25, 0.9)",
              fontSize: "16px",
              fontWeight: 600,
              mt: 2,
            }}
          >
            Upload Files
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "12px",
              mt: 1,
            }}
          >
            (.jpg, .jpeg, .png, .svg, .glb)
          </Typography>
        </Box>
      </GlassBox>
    );
  }
);

// Asset List Component
const AssetList = memo(
  ({
    assets,
    onCheckboxChange,
    onDelete,
    onEdit,
  }: {
    assets: EnvAsset[];
    onCheckboxChange: (
      event: React.ChangeEvent<HTMLInputElement>,
      params: { assetId: string }
    ) => void;
    onDelete: (assetId: string) => void;
    onEdit: (assetId: string) => void;
  }) => {
    return (
      <GlassBox sx={{ p: 3, mb: 2 }}>
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "18px",
            fontWeight: 600,
            color: "white",
            mb: 2,
          }}
        >
          Assets
        </Typography>
        <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
          {assets.map((asset) => (
            <Box
              key={asset.id}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                mb: 1,
                borderRadius: "12px",
                background: asset.isEnvironmentAsset
                  ? "rgba(245, 175, 25, 0.1)"
                  : "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(245, 175, 25, 0.15)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Checkbox
                checked={asset.isEnvironmentAsset || false}
                onChange={(event) =>
                  onCheckboxChange(event, { assetId: asset.id })
                }
                sx={{
                  color: "rgba(245, 175, 25, 0.8)",
                  "&.Mui-checked": {
                    color: "rgba(245, 175, 25, 1)",
                  },
                }}
              />
              <Box
                component="img"
                src={asset.type === "PHOTO" ? asset.src : (asset.image ? asset.image : "icons/Cube.svg")}
                sx={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  mr: 2,
                  opacity: asset.isEnvironmentAsset ? 1 : 0.5,
                  backgroundColor:
                    asset.type === "PHOTO"
                      ? "transparent"
                      : "rgba(77, 177, 255, 0.1)",
                }}
              />
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: asset.isEnvironmentAsset
                    ? "white"
                    : "rgba(255, 255, 255, 0.5)",
                  fontSize: "14px",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  cursor: asset.isEnvironmentAsset ? "pointer" : "default",
                  "&:hover": {
                    textDecoration: asset.isEnvironmentAsset
                      ? "underline"
                      : "none",
                  },
                }}
                onClick={() => asset.isEnvironmentAsset && onEdit(asset.id)}
              >
                {asset.name}
              </Typography>
              {asset.isEnvironmentAsset && (
                <Button
                  size="small"
                  onClick={() => onEdit(asset.id)}
                  sx={{
                    minWidth: "40px",
                    color: "rgba(245, 175, 25, 0.8)",
                    "&:hover": { color: "white" },
                    ml: asset.source === "OWN" ? 0 : 1,
                  }}
                >
                  <Settings size={18} />
                </Button>
              )}
              {asset.source === "OWN" && (
                <Button
                  size="small"
                  onClick={() => onDelete(asset.id)}
                  sx={{
                    minWidth: "40px",
                    color: "rgba(255, 100, 100, 0.8)",
                    "&:hover": { color: "rgba(255, 100, 100, 1)" },
                  }}
                >
                  <Trash2 size={18} />
                </Button>
              )}
            </Box>
          ))}
        </Box>
      </GlassBox>
    );
  }
);

// Media Editor Component
const MediaEditor = memo(
  ({
    product,
    envProduct,
    mediaType,
    onMediaSelect,
  }: {
    product: Product;
    envProduct: EnvProduct;
    mediaType: "PHOTO" | "MODEL_3D";
    onMediaSelect: (type: "PHOTO" | "MODEL_3D", index: number) => void;
  }) => {
    return (
      <GlassBox sx={{ p: 3, mb: 2 }}>
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "18px",
            fontWeight: 600,
            color: "white",
            mb: 2,
          }}
        >
          Select {mediaType === "PHOTO" ? "Image" : "3D Model"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {mediaType === "PHOTO" &&
            product.images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: "calc(50% - 6px)",
                  aspectRatio: "1 / 1",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background:
                    envProduct.imageIndex === index
                      ? "rgba(245, 175, 25, 0.2)"
                      : "rgba(255, 255, 255, 0.05)",
                  border:
                    envProduct.imageIndex === index
                      ? "2px solid rgba(245, 175, 25, 1)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    background: "rgba(245, 175, 25, 0.15)",
                  },
                }}
                onClick={() => onMediaSelect("PHOTO", index)}
              >
                <Box
                  component="img"
                  src={image.src}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}

          {mediaType === "MODEL_3D" &&
            product.models.map((model, index) => (
              <Box
                key={index}
                sx={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background:
                    envProduct.modelIndex === index
                      ? "rgba(245, 175, 25, 0.2)"
                      : "rgba(255, 255, 255, 0.05)",
                  border:
                    envProduct.modelIndex === index
                      ? "2px solid rgba(245, 175, 25, 1)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => onMediaSelect("MODEL_3D", index)}
                  sx={{
                    background: "linear-gradient(135deg, #f12711, #f5af19)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(135deg, #FF4E33, #FFC13B)",
                    },
                  }}
                >
                  Use This Model
                </Button>
                <ModelViewer
                  style={{
                    width: "100%",
                    height: "80%",
                    backgroundColor: "rgb(15, 15, 15)",
                    borderRadius: "8px",
                  }}
                  data={{
                    id: model.id,
                    sources: [model.sources && model.sources[0]],
                    alt: "3D Model",
                  }}
                  ar={true}
                  arModes="scene-viewer webxr quick-look"
                  arScale="auto"
                  iosSrc={model.sources && model.sources[1]?.url}
                  cameraControls={true}
                  environmentImage="neutral"
                  poster=""
                  alt="A 3D model of a product"
                />
                
              </Box>
            ))}
        </Box>
      </GlassBox>
    );
  }
);

// Placeholder Editor Component
const PlaceholderEditor = memo(
  ({
    placeHolderData,
    envProducts,
    products,
    envAssets,
    activeEnvProduct,
    onPlaceholderSelect,
  }: {
    placeHolderData: PlaceHolderData[];
    envProducts: { [id: number]: EnvProduct };
    products: Product[];
    envAssets: { [id: string]: EnvAsset };
    activeEnvProduct: EnvProduct;
    onPlaceholderSelect: (placeholderId: number) => void;
  }) => {
    return (
      <GlassBox sx={{ p: 3, mb: 2 }}>
        <Typography
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "18px",
            fontWeight: 600,
            color: "white",
            mb: 2,
          }}
        >
          Placeholder Positions
        </Typography>
        <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
          {placeHolderData.map((placeholder) => {
            const placeholderEntity = Object.values(envProducts).find(
              (envProduct: EnvProduct) =>
                envProduct.placeHolderId === placeholder.id
            );

            return (
              <Box
                key={placeholder.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  mb: 1,
                  borderRadius: "12px",
                  background:
                    activeEnvProduct.placeHolderId === placeholder.id
                      ? "rgba(245, 175, 25, 0.2)"
                      : "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <AnimatedChip
                  label={placeholder.id}
                  size="small"
                  sx={{ mr: 2 }}
                />
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color:
                      activeEnvProduct.placeHolderId === placeholder.id
                        ? "white"
                        : "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {products.find(
                    (product) => product.id === placeholderEntity?.id
                  )?.title ||
                    envAssets[placeholderEntity?.id || ""]?.name ||
                    "Available"}
                </Typography>
                <Button
                  variant="contained"
                  disabled={placeholderEntity !== undefined}
                  onClick={() => onPlaceholderSelect(placeholder.id)}
                  sx={{
                    background: placeholderEntity
                      ? "rgba(100, 100, 100, 0.5)"
                      : "linear-gradient(135deg, #f12711, #f5af19)",
                    color: "white",
                    minWidth: "80px",
                    "&:hover": !placeholderEntity
                      ? {
                          background:
                            "linear-gradient(135deg, #FF4E33, #FFC13B)",
                        }
                      : {},
                  }}
                >
                  {placeholderEntity ? "In Use" : "Use"}
                </Button>
              </Box>
            );
          })}
        </Box>
      </GlassBox>
    );
  }
);

export const CreatorKit = () => {
  const { products } = useComponentStore();
  const {
    envAssets,
    modifyEnvAsset,
    setEnvAssets,
    activeAssetId,
    setActiveAssetId,
  } = useEnvAssetStore();
  const { envProducts, modifyEnvProduct, activeProductId, setActiveProductId } =
    useEnvProductStore();
  const { toolType, setToolType } = useToolStore();
  const { brandData } = useBrandStore();

  const [entityType, setEntityType] = useState<"PRODUCT" | "ASSET">("PRODUCT");
  const [mediaType, setMediaType] = useState<"PHOTO" | "MODEL_3D">("PHOTO");
  const [paramsType, setParamsType] = useState<"CUSTOM" | "PLACEHOLDER">(
    "CUSTOM"
  );
  const [assetSource, setAssetSource] = useState<"LIBRARY" | "OWN">("LIBRARY");

  // Track previous state for products
  const [previousProductState, setPreviousProductState] = useState<EnvProduct | null>(null);

  // Load Placeholder data
  const placeHolderData = useMemo(() => {
    if (!brandData) return null;
    return environmentData[brandData?.environment_name.toUpperCase()]
      .placeHolderData;
  }, [brandData]);

  // Current active item
  const activeEnvProduct = useMemo(() => {
    return activeProductId ? envProducts[activeProductId] : null;
  }, [activeProductId, envProducts]);

  const activeEnvAsset = useMemo(() => {
    return activeAssetId ? envAssets[activeAssetId] : null;
  }, [activeAssetId, envAssets]);

  // Handle entity type change
  const handleEntityTypeChange = useCallback(
    (type: "PRODUCT" | "ASSET") => {
      if (type !== entityType) {
        setEntityType(type);
        setActiveProductId(null);
        setActiveAssetId(null);
        setToolType(null);
        if (type === "ASSET") {
          setParamsType("CUSTOM");
        }
      }
    },
    [entityType, setActiveProductId, setActiveAssetId, setToolType]
  );

  // Handle checkbox change for products/assets
  const handleCheckboxChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      parameters: { productId?: number; assetId?: string }
    ) => {
      if (entityType === "PRODUCT" && parameters.productId) {
        const product = products.find(
          (product) => product.id === parameters.productId
        );
        if (!product) return;

        if (event.target.checked) {
          // Premium limits check
          if (
            Object.values(envProducts).filter(
              (envProduct) => envProduct.isEnvironmentProduct
            ).length >= 20
          ) {
            showPremiumPopup(
              "Your current plan supports up to 20 products. Reach out to our sales team to unlock more exclusive options."
            );
            return;
          }

          const existingEnvProduct = envProducts[product.id];
          if (
            existingEnvProduct?.type === "MODEL_3D" &&
            Object.values(envProducts).filter(
              (envProduct) =>
                envProduct.type === "MODEL_3D" &&
                envProduct.isEnvironmentProduct
            ).length >= 5
          ) {
            showPremiumPopup(
              "Your current plan supports only up to 5 product models. Reach out to our sales team to unlock more exclusive options."
            );
            return;
          }
        }

        const isProductFirstTime =
          !envProducts[product.id]?.imageIndex &&
          !envProducts[product.id]?.modelIndex;

        if (event.target.checked && isProductFirstTime) {
          setToolType("MEDIA");
          setMediaType("PHOTO");
          setActiveProductId(product.id);
          // Preload models
          product.models.forEach((model) => {
            useGLTF.preload(model.sources?.[0].url || "");
          });
        } else {
          setActiveProductId(null);
          setToolType(null);
        }

        const newEnvProduct: EnvProduct = {
          id: product.id,
          isEnvironmentProduct: event.target.checked,
          imageIndex: isProductFirstTime
            ? 0
            : envProducts[product.id]?.imageIndex,
        };

        modifyEnvProduct(product.id, newEnvProduct);
      } else if (entityType === "ASSET" && parameters.assetId) {
        const envAsset = envAssets[parameters.assetId];
        if (!envAsset) return;

        if (event.target.checked) {
          if (
            Object.values(envAssets).filter(
              (envAsset) => envAsset.isEnvironmentAsset
            ).length >= 5
          ) {
            showPremiumPopup(
              "Your current plan supports only up to 5 assets. Reach out to our sales team to unlock more exclusive options."
            );
            return;
          }

          setActiveAssetId(envAsset.id);
          if (envAsset.type === "MODEL_3D") {
            useGLTF.preload(envAsset.src);
          }
        } else {
          setActiveAssetId(null);
        }

        const updatedEnvAsset = {
          ...envAsset,
          isEnvironmentAsset: event.target.checked,
        };
        modifyEnvAsset(envAsset.id, updatedEnvAsset);
      }
    },
    [
      entityType,
      products,
      envProducts,
      envAssets,
      modifyEnvProduct,
      modifyEnvAsset,
      setToolType,
      setMediaType,
      setActiveProductId,
      setActiveAssetId,
    ]
  );

  // Handle file upload for assets
  const handleFileUpload = useCallback(
    async (files: File[]) => {
      if (!brandData) return;

      try {
        const result = await AssetService.uploadAssetFiles(
          brandData.brand_name,
          files,
          Object.values(envAssets).filter(
            (envAsset) =>
              envAsset.isEnvironmentAsset && envAsset.source === "OWN"
          ).length
        );

        if (result && result.assets) {
          Object.keys(result.assets).forEach((id) => {
            const uploadedAssetData = result.assets[id];
            const assetWithDefaults: EnvAsset = {
              ...uploadedAssetData,
              position: uploadedAssetData.position || [0, 0, 0],
              rotation: uploadedAssetData.rotation || [0, 0, 0],
              scale:
                typeof uploadedAssetData.scale === "number"
                  ? uploadedAssetData.scale
                  : 1,
              isEnvironmentAsset: uploadedAssetData.isEnvironmentAsset || false, // Default to not on canvas
            };
            modifyEnvAsset(id, assetWithDefaults);
          });

          // Check for any errors
          if (result.fileErrors && result.fileErrors.length > 0) {
            if (
              result.fileErrors
                .map((fileError) => fileError.code)
                .includes(ERROR_CODES.FILE_TOO_LARGE)
            ) {
              showPremiumPopup(
                "Your current plan only supports assets of maximum size 2MB. Reach out to our sales team for more exclusive options."
              );
            }
          }
        }
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    },
    [brandData, envAssets, modifyEnvAsset]
  );

  // Handle asset deletion
  const handleDeleteAsset = useCallback(
    async (assetId: string) => {
      if (!brandData) return;

      const result = await Swal.fire({
        title: "Delete Asset?",
        text: "This action is irreversible. Are you sure you want to delete this asset?",
        icon: "warning",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        confirmButtonColor: "#f12711",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
        },
      });

      /* ------------------------------------------------------------------
         EXIT EARLY ON CANCEL
      ------------------------------------------------------------------ */
      if (!result.isConfirmed) return;

      /* ------------------------------------------------------------------
         1. OPTIMISTICALLY UPDATE THE UI
      ------------------------------------------------------------------ */
      // Keep a snapshot so we can roll back if the API call fails
      const removedAsset = envAssets[assetId];

      // Build a new shallow copy of envAssets *without* the deleted asset
      const { [assetId]: _discard, ...restAssets } = envAssets;
      setEnvAssets(restAssets);           // <- zustand expects the new object

      // Clear selection/tool state if it was tied to the deleted asset
      if (activeAssetId === assetId) {
        setActiveAssetId(null);
        if (toolType) setToolType(null);
      }

      /* ------------------------------------------------------------------
         2. PERFORM THE BACK‑END DELETE
      ------------------------------------------------------------------ */
      try {
        const response = await AssetService.deleteAssetFile(
          brandData.brand_name,
          assetId
        );

        if (response.status !== 200) {
          throw new Error("Failed to delete asset");
        }

        // Success toast
        Swal.fire({
          title: "Asset Deleted",
          text: "The asset has been successfully deleted",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            title: styles.swalTitle,
            popup: styles.swalPopup,
          },
        });
      } catch (error) {
        /* ----------------------------------------------------------------
           3. ROLLBACK ON FAILURE
        ---------------------------------------------------------------- */
        if (removedAsset) {
          // Restore the original asset map
          setEnvAssets({ ...envAssets, [assetId]: removedAsset });
        }

        console.error("Error deleting asset:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete the asset. Please try again.",
          icon: "error",
          customClass: {
            title: styles.swalTitle,
            popup: styles.swalPopup,
          },
        });
      }
    },
    [brandData, envAssets, setEnvAssets, activeAssetId, setActiveAssetId, toolType, setToolType]
  );

  // Handle media selection for products
  const handleMediaSelect = useCallback(
    (type: "MODEL_3D" | "PHOTO", index: number) => {
      if (!activeProductId) return;

      const product = products.find(
        (product) => product.id === activeProductId
      );
      if (!product) return;

      // Ensure there are not more than 5 model products
      if (type === "MODEL_3D") {
        if (
          Object.values(envProducts).filter(
            (envProduct) =>
              envProduct.type === "MODEL_3D" && envProduct.isEnvironmentProduct
          ).length >= 5
        ) {
          showPremiumPopup(
            "Your current plan supports only up to 5 product models. Reach out to our sales team to unlock more exclusive options."
          );
          return;
        }
      }

      const envProduct: EnvProduct = {
        id: product.id,
        type: type,
        imageIndex: type === "PHOTO" ? index : undefined,
        modelIndex: type === "MODEL_3D" ? index : undefined,
        isEnvironmentProduct: true,
      };

      modifyEnvProduct(product.id, envProduct);
    },
    [activeProductId, products, envProducts, modifyEnvProduct]
  );

  // Handle placeholder selection
  const handlePlaceholderSelect = useCallback(
    (placeholderId: number) => {
      if (!activeEnvProduct) return;

      const newEnvProduct: EnvProduct = {
        ...activeEnvProduct,
        placeHolderId: placeholderId,
        isEnvironmentProduct: true,
      };

      if (placeHolderData) {
        const placeHolder = placeHolderData.find(
          (placeHolder) => placeHolder.id === placeholderId
        );
        if (placeHolder) {
          newEnvProduct.position = placeHolder.position;
          newEnvProduct.rotation = placeHolder.rotation;
          newEnvProduct.scale = placeHolder.scale;
        }
      }

      modifyEnvProduct(activeEnvProduct.id, newEnvProduct);
    },
    [activeEnvProduct, placeHolderData, modifyEnvProduct]
  );

  // Handle params type change
  const handleParamsTypeChange = useCallback(
    (type: "CUSTOM" | "PLACEHOLDER") => {
      setParamsType(type);

      if (entityType === "PRODUCT" && activeEnvProduct && type === "CUSTOM") {
        const newEnvProduct: EnvProduct = {
          ...activeEnvProduct,
          placeHolderId: undefined,
          isEnvironmentProduct: true,
        };

        if (activeEnvProduct.placeHolderId !== undefined && placeHolderData) {
          const placeHolder = placeHolderData.find(
            (placeHolder) => placeHolder.id === activeEnvProduct.placeHolderId
          );
          if (placeHolder) {
            newEnvProduct.position = placeHolder.position;
            newEnvProduct.rotation = placeHolder.rotation;
            newEnvProduct.scale = placeHolder.scale;
          }
        }
        modifyEnvProduct(activeEnvProduct.id, newEnvProduct);
      }
    },
    [entityType, activeEnvProduct, placeHolderData, modifyEnvProduct]
  );

  // Handle 3D parameter changes
  const handlePositionChange = useCallback(
    (value: [number, number, number]) => {
      if (entityType === "PRODUCT" && activeEnvProduct) {
        modifyEnvProduct(activeEnvProduct.id, {
          ...activeEnvProduct,
          position: value,
        });
      } else if (entityType === "ASSET" && activeEnvAsset) {
        modifyEnvAsset(activeEnvAsset.id, {
          ...activeEnvAsset,
          position: value,
        });
      }
    },
    [
      entityType,
      activeEnvProduct,
      activeEnvAsset,
      modifyEnvProduct,
      modifyEnvAsset,
    ]
  );

  const handleRotationChange = useCallback(
    (value: [number, number, number]) => {
      if (entityType === "PRODUCT" && activeEnvProduct) {
        modifyEnvProduct(activeEnvProduct.id, {
          ...activeEnvProduct,
          rotation: value,
        });
      } else if (entityType === "ASSET" && activeEnvAsset) {
        modifyEnvAsset(activeEnvAsset.id, {
          ...activeEnvAsset,
          rotation: value,
        });
      }
    },
    [
      entityType,
      activeEnvProduct,
      activeEnvAsset,
      modifyEnvProduct,
      modifyEnvAsset,
    ]
  );

  const handleScaleChange = useCallback(
    (value: number) => {
      if (entityType === "PRODUCT" && activeEnvProduct) {
        modifyEnvProduct(activeEnvProduct.id, {
          ...activeEnvProduct,
          scale: value,
        });
      } else if (entityType === "ASSET" && activeEnvAsset) {
        modifyEnvAsset(activeEnvAsset.id, { ...activeEnvAsset, scale: value });
      }
    },
    [
      entityType,
      activeEnvProduct,
      activeEnvAsset,
      modifyEnvProduct,
      modifyEnvAsset,
    ]
  );

  const handleFaceChange = useCallback(
    (value: "N" | "S" | "E" | "W") => {
      if (entityType === "PRODUCT" && activeEnvProduct) {
        modifyEnvProduct(activeEnvProduct.id, {
          ...activeEnvProduct,
          face: value,
        });
      }
    },
    [entityType, activeEnvProduct, modifyEnvProduct]
  );

  // Save store function
  const handleSaveStore = useCallback(async () => {
    if (!brandData) return;

    const result = await Swal.fire({
      title: "Save Store?",
      text: "Are you sure you want to save the store?",
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
      customClass: {
        title: styles.swalTitle,
        popup: styles.swalPopup,
      },
    });

    if (result.isConfirmed) {
      try {
        const envResponse = await EnvStoreService.storeEnvData(
          brandData.brand_name,
          Object.values(envProducts).filter(
            (envProduct) => envProduct.isEnvironmentProduct
          ),
          Object.values(envAssets).filter(
            (envAsset) => envAsset.isEnvironmentAsset
          )
        );

        console.log(envResponse);

        Swal.fire({
          title: "XR Store Updated",
          text: "Your store has been updated successfully!",
          html: `<a href="https://${brandData.brand_name}.shackit.com" target="_blank">Go to your XR Store</a>`,
          icon: "success",
          allowOutsideClick: false,
          customClass: {
            title: styles.swalTitle,
            popup: styles.swalPopup,
            htmlContainer: styles.swalPopup,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [brandData, envProducts, envAssets]);

  return (
    <Box
      sx={{
        width: "30%",
        height: "100vh",
        position: "fixed",
        left: 0,
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, rgba(10, 10, 20, 0.95), rgba(15, 15, 30, 0.9))",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        pointerEvents: "auto",
        overflow: "hidden",
      }}
      onClick={(event) => event.stopPropagation()}
    >
      {/* Header */}
      <Box sx={{p: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.1)", display: 'flex', alignItems: 'center', gap: 2 }}>
        {(activeProductId || activeAssetId) && (
          <GlassButton
            onClick={() => {
              if(!previousProductState){
                if (entityType === "PRODUCT" && activeProductId) {
                  // Create a synthetic event for the checkbox
                  const syntheticEvent = {
                    target: { checked: false }
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleCheckboxChange(syntheticEvent, { productId: activeProductId });
                } else if (entityType === "ASSET" && activeAssetId) {
                  // Create a synthetic event for the checkbox
                  const syntheticEvent = {
                    target: { checked: false }
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleCheckboxChange(syntheticEvent, { assetId: activeAssetId });
                }
                return;
              }
              if (entityType === "PRODUCT") {
                // If we have previous state and a tool is active, restore it
                if (previousProductState && toolType) {
                  modifyEnvProduct(previousProductState.id, previousProductState);
                }
                setActiveProductId(null);
                setPreviousProductState(null);
              } else {
                setActiveAssetId(null);
              }
              setToolType(null);
            }}
            sx={{
              position: 'absolute',
              minWidth: '48px',
              width: '48px',
              height: '48px',
              padding: 0,
              background: "rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              component="img"
              src="/icons/Back.png"
              sx={{
                width: '24px',
                height: '24px',
                objectFit: 'contain'
              }}
              alt="Back"
            />
          </GlassButton>
        )}
        <Box
          component="img"
          src="/Logo SF.png"
          sx={{
            height: '35px',
            width: 'auto',
            flex: 1,
            objectFit: 'contain',
          }}
          alt="Strategy Fox Logo"
        />
      </Box>

      {/* Scrollable content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 2,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(245, 175, 25, 0.5)",
            borderRadius: "3px",
            "&:hover": {
              background: "rgba(245, 175, 25, 0.7)",
            },
          },
        }}
      >
        {/* Entity Type Selector */}
        <EntityTypeSelector
          entityType={entityType}
          onEntityTypeChange={handleEntityTypeChange}
        />

        {/* Products Section */}
        {entityType === "PRODUCT" && (
          <>
            {!activeProductId && (
              <GlassBox sx={{ p: 3, mb: 2 }}>
                <Typography
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "white",
                    mb: 2,
                  }}
                >
                  Products
                </Typography>
                <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                  {products.map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        mb: 1,
                        borderRadius: "12px",
                        background: envProducts[product.id]
                          ?.isEnvironmentProduct
                          ? "rgba(245, 175, 25, 0.1)"
                          : "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "rgba(245, 175, 25, 0.15)",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Checkbox
                        checked={
                          envProducts[product.id]?.isEnvironmentProduct || false
                        }
                        onChange={(event) =>
                          handleCheckboxChange(event, { productId: product.id })
                        }
                        sx={{
                          color: "rgba(245, 175, 25, 0.8)",
                          "&.Mui-checked": {
                            color: "rgba(245, 175, 25, 1)",
                          },
                        }}
                      />
                      <Box
                        component="img"
                        src={product.images[0]?.src}
                        sx={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          mr: 2,
                          opacity: envProducts[product.id]?.isEnvironmentProduct
                            ? 1
                            : 0.5,
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          color: envProducts[product.id]?.isEnvironmentProduct
                            ? "white"
                            : "rgba(255, 255, 255, 0.5)",
                          fontSize: "14px",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.title}
                      </Typography>
                      {envProducts[product.id]?.isEnvironmentProduct && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            onClick={() => {
                              setMediaType(
                                envProducts[product.id]?.type || "PHOTO"
                              );
                              setActiveProductId(product.id);
                               // Save current state before changing tool
                              setPreviousProductState(envProducts[product.id]);
                              setToolType("MEDIA");
                            }}
                            sx={{
                              minWidth: "40px",
                              color: "rgba(245, 175, 25, 0.8)",
                              "&:hover": { color: "white" },
                            }}
                          >
                            <ImageIcon size={18} />
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              if (
                                envProducts[product.id]?.imageIndex !==
                                  undefined ||
                                envProducts[product.id]?.modelIndex !==
                                  undefined
                              ) {
                                // Save current state before changing tool
                                setPreviousProductState(envProducts[product.id]);
                                setParamsType(
                                  envProducts[product.id].placeHolderId !==
                                    undefined
                                    ? "PLACEHOLDER"
                                    : "CUSTOM"
                                );
                                setActiveProductId(product.id);
                                setToolType("3DPARAMS");
                              }
                            }}
                            sx={{
                              minWidth: "40px",
                              color: "rgba(245, 175, 25, 0.8)",
                              "&:hover": { color: "white" },
                            }}
                          >
                            <Settings size={18} />
                          </Button>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </GlassBox>
            )}

            {/* Product Editor */}
            {activeProductId && (
              <>
                {toolType === "MEDIA" && (
                  <>
                    <MediaTypeSelector
                      mediaType={mediaType}
                      onMediaTypeChange={setMediaType}
                    />
                    {(() => {
                      const product = products.find(
                        (p) => p.id === activeProductId
                      );
                      return (
                        product &&
                        activeEnvProduct && (
                          <MediaEditor
                            product={product}
                            envProduct={activeEnvProduct}
                            mediaType={mediaType}
                            onMediaSelect={handleMediaSelect}
                          />
                        )
                      );
                    })()}
                  </>
                )}

                {toolType === "3DPARAMS" && (
                  <>
                    <ParamsTypeSelector
                      paramsType={paramsType}
                      onParamsTypeChange={handleParamsTypeChange}
                    />

                    {paramsType === "CUSTOM" && activeEnvProduct && (
                      <>
                        <Vector3Control
                          label="Position"
                          value={
                            (activeEnvProduct.position as [
                              number,
                              number,
                              number
                            ]) || [0, 0, 0]
                          }
                          onChange={handlePositionChange}
                          min={-30}
                          max={30}
                          step={0.15}
                          icon={Move3D}
                        />
                        <Vector3Control
                          label="Rotation"
                          value={
                            (activeEnvProduct.rotation as [
                              number,
                              number,
                              number
                            ]) || [0, 0, 0]
                          }
                          onChange={handleRotationChange}
                          min={-180}
                          max={180}
                          step={1}
                          icon={RotateCcw}
                        />
                        <GlassBox sx={{ p: 3, mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                              gap: 1,
                            }}
                          >
                            <ZoomIn size={18} />
                            <Typography
                              sx={{
                                fontFamily: "'Poppins', sans-serif",
                                color: "white",
                                fontSize: "16px",
                                fontWeight: 600,
                              }}
                            >
                              Scale
                            </Typography>
                          </Box>
                          <SliderControl
                            label="Scale"
                            value={activeEnvProduct.scale || 1}
                            onChange={handleScaleChange}
                            min={0.1}
                            max={5}
                            step={0.1}
                          />
                        </GlassBox>
                        <FaceSelector
                          value={activeEnvProduct.face}
                          onChange={handleFaceChange}
                        />
                      </>
                    )}

                    {paramsType === "PLACEHOLDER" &&
                      activeEnvProduct &&
                      placeHolderData && (
                        <PlaceholderEditor
                          placeHolderData={placeHolderData}
                          envProducts={envProducts}
                          products={products}
                          envAssets={envAssets}
                          activeEnvProduct={activeEnvProduct}
                          onPlaceholderSelect={handlePlaceholderSelect}
                        />
                      )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Assets Section */}
        {entityType === "ASSET" && (
          <>
            {/* Asset Source Selector */}
            <GlassBox sx={{ p: 3, mb: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <GlassButton
                  isPrimary={assetSource === "LIBRARY"}
                  onClick={() => {
                    setAssetSource("LIBRARY");
                    setActiveAssetId(null);
                  }}
                  fullWidth
                >
                  Library
                </GlassButton>
                <GlassButton
                  isPrimary={assetSource === "OWN"}
                  onClick={() => {
                    setAssetSource("OWN");
                    setActiveAssetId(null);
                  }}
                  fullWidth
                >
                  Your Assets
                </GlassButton>
              </Box>
            </GlassBox>

            {/* File Upload for OWN assets */}
            {assetSource === "OWN" && !activeAssetId && (
              <FileUploadArea onUpload={handleFileUpload} />
            )}

            {/* Asset List */}
            {!activeAssetId && (
              <AssetList
                assets={Object.values(envAssets).filter(
                  (asset) => asset.source === assetSource
                )}
                onCheckboxChange={handleCheckboxChange}
                onDelete={handleDeleteAsset}
                onEdit={setActiveAssetId}
              />
            )}

            {/* Asset parameters for active asset */}
            {activeAssetId && activeEnvAsset && (
              <>
                <Vector3Control
                  label="Position"
                  value={
                    (activeEnvAsset.position as [number, number, number]) || [
                      0, 0, 0,
                    ]
                  }
                  onChange={handlePositionChange}
                  min={-20}
                  max={20}
                  step={0.1}
                  icon={Move3D}
                />
                <Vector3Control
                  label="Rotation"
                  value={
                    (activeEnvAsset.rotation as [number, number, number]) || [
                      0, 0, 0,
                    ]
                  }
                  onChange={handleRotationChange}
                  min={-180}
                  max={180}
                  step={1}
                  icon={RotateCcw}
                />
                <GlassBox sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1.5,
                      gap: 1,
                    }}
                  >
                    <ZoomIn size={18} />
                    <Typography
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: 600,
                      }}
                    >
                      Scale
                    </Typography>
                  </Box>
                  <SliderControl
                    label="Scale"
                    value={activeEnvAsset.scale || 1}
                    onChange={handleScaleChange}
                    min={0.1}
                    max={5}
                    step={0.1}
                  />
                </GlassBox>
              </>
            )}
          </>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 3, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        {!activeProductId && !activeAssetId ? (
          <GlassButton
            isPrimary
            onClick={handleSaveStore}
            startIcon={<Save size={18} />}
            fullWidth
            size="large"
          >
            Save Store
          </GlassButton>
        ) : (
          <GlassButton
            isPrimary
            onClick={() => {
              if (entityType === "PRODUCT") {
                // Clear previous state when done
                setPreviousProductState(null);
                setActiveProductId(null);
              } else {
                setActiveAssetId(null);
              }
              setToolType(null);
            }}
            startIcon={<Check size={18} />}
            fullWidth
            size="large"
          >
            Done
          </GlassButton>
        )}
      </Box>
    </Box>
  );
};
