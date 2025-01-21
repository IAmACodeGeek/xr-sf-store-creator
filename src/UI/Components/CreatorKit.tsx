import { Box, Button, Typography } from "@mui/material";

import { useComponentStore, useEnvProductStore } from "../../stores/ZustandStores";
import { useEffect, useRef, useState } from "react";
import { ModelViewer } from "@shopify/hydrogen-react";

export const CreatorKit = () => {
  const { products, selectedProduct, setSelectedProduct } = useComponentStore();
  const { envProducts, modifyEnvProduct } = useEnvProductStore();

  // For saving and retrieving scroll position from session storage
  const productListRef = useRef<HTMLDivElement>(null);
  const productPaneRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = () => {
    if (productListRef.current) {
      sessionStorage.setItem("productListScrollPosition", productListRef.current.scrollTop.toString());
    }
    if (productPaneRef.current){
      sessionStorage.setItem("productPaneScrollPosition", productPaneRef.current.scrollTop.toString());
    }
  };

  useEffect(() => {
    if(productPaneRef.current){
      const storedScrollPosition = sessionStorage.getItem("productPaneScrollPosition");
      if(storedScrollPosition){
        productPaneRef.current.scrollTop = parseFloat(storedScrollPosition);
      }
    }
  }, [envProducts]);

  const ProductPane = () => {
    const MediaSelector = () => {
      const mediaTypes = ["Image", "Model_3D"];

      const createEnvProduct = (type: string, index: number) => {
        if(!selectedProduct) return;
        const envProduct = {
          id: selectedProduct.id,
          type: type,
          imageIndex: (type === "PHOTO" || type === "PSEUDO_3D")? index : undefined,
          modelIndex: (type === "MODEL_3D")? index : undefined,
          isEnvironmentProduct: true,
        };
        modifyEnvProduct(envProduct.id, envProduct);
      }

      return (
        <Box
          sx={{
            width: "100%",
            display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center",
            gap: "25px", marginTop: "20px",
          }}
          className="MediaSelector"
        >
          {mediaTypes.map((mediaType: string) => {
            return (
              <Box
                sx={{
                  width: "100%",
                  display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "flex-start",
                  gap: "10px",
                }}
                className="MediaOption"
                key={mediaType}
              >
                <Typography
                  sx={{
                    maxWidth: "100%", width: "100%",
                    overflowWrap: "break-word",
                    fontSize: "20px", fontFamily: "'Poppins', sans-serif",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  {mediaType}
                </Typography>
                <Box
                  sx={{
                    display: "flex", flexDirection: "row", justifyContent: "center", alignItems: 'center',
                    flexWrap: "wrap", gap: "20px", 
                    width: "100%"
                  }}
                  className="ListofValues"
                >
                  {(mediaType.toUpperCase() === "IMAGE") &&
                    selectedProduct?.images.map((image, index) => {
                      return (
                        <Box
                          sx={{
                            width: "180px", minWidth: "180px",
                            display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center",
                            backgroundColor: (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].imageIndex === index)?
                            "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.03)",
                            padding: "15px", boxSizing: "border-box",
                            gap: "20px"
                          }}
                          key={image.src}
                        >
                          <Box
                            component="img"
                            src={image.src}
                            sx={{
                              width: "100%", minWidth: "100%", aspectRatio: "1 / 1",
                              backgroundColor: "rgba(255, 255, 255, 0.075)",
                            }}
                          />
                          <Button
                            sx={{
                              width: "100%", minWidth: "100%",
                              backgroundColor: "#24a0ed", color: "white",
                              borderRadius: "0",
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "14px"
                            }}
                            disabled={
                              (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].type === "PHOTO") && 
                              (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].imageIndex === index)
                            }
                            className="UseAsPhotoButton"
                            onClick={() => {
                              createEnvProduct("PHOTO", index)
                            }}
                          >
                            Use as Photo
                          </Button>
                          <Button
                            sx={{
                              width: "100%", minWidth: "100%",
                              backgroundColor: "#24a0ed", color: "white",
                              borderRadius: "0",
                              fontFamily: "'Poppins', sans-serif", 
                              fontSize: "14px"
                            }}
                            className="Pseudo3dButton"
                            disabled={
                              (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].type === "PSEUDO_3D") &&
                              (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].imageIndex === index)
                            }
                            onClick={() => {
                              createEnvProduct("PSEUDO_3D", index)
                            }}
                          >
                            Pseudo 3D
                          </Button>
                        </Box>
                      );
                    })
                  }
                  {(mediaType.toUpperCase() === "MODEL_3D") &&
                    selectedProduct?.models.map((model, index) => {
                      
                      const modelData = {
                        id: model.id,
                        sources: [model.sources && model.sources[0]],
                        alt: "3D Model"
                      };
                      const iosSrc = model.sources && model.sources[1].url;
                      
                      return (
                        <Box
                          sx={{
                            width: "230px", minWidth: "230px",
                            display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            padding: "15px", boxSizing: "border-box",
                            gap: "20px"
                          }}
                          key={model.id}
                        >                      
                          <Box
                            sx={{
                              width: "200px", minWidth: "200px", aspectRatio: "1 / 1",
                              "& model-viewer": {
                                "--poster-color": "transparent",
                                "--ar-button-display": "none !important",
                              }
                            }}
                          >
                            <ModelViewer
                              style={{
                                height: "100%",
                                width: "100%",
                              }}
                              data={modelData}
                              ar={true} 
                              arModes="scene-viewer webxr quick-look" 
                              arScale="auto" 
                              iosSrc={iosSrc} 
                              cameraControls={true} 
                              environmentImage="neutral" 
                              poster="" 
                              alt="A 3D model of a product"
                              onArStatus={(event: unknown) => console.log("AR Status:", event)} 
                              onLoad={() => console.log("Model loaded")} 
                            />
                          </Box>
                          <Button
                            sx={{
                              width: "100%", minWidth: "100%",
                              backgroundColor: "#24a0ed", color: "white",
                              borderRadius: "0",
                              fontFamily: "'Poppins', sans-serif", 
                              fontSize: "14px"
                            }}
                            disabled={
                              (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].type === "MODEL_3D") &&
                              (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].modelIndex === index)
                            }
                            onClick={() => {
                              createEnvProduct("MODEL_3D", index)
                            }}
                          >
                            Use 3D Model
                          </Button>
                        </Box>
                      );
                    })
                  }
                </Box>
              </Box>
            );
          })}
        </Box>
      );
    };

    return (
      <Box
        sx={{
          display: "flex", flexDirection: "column", justifyContent: "start",
          height: "100%", width: "60%",
          overflowY: "scroll", "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          padding: "20px", boxSizing: "border-box",
          borderRadius: "0 20px 20px 0"
        }}
        onScroll={handleScroll}
        ref={productPaneRef}
        className="ProductPane"
      >
        <Typography
            sx={{
              fontSize: "24px", fontFamily: "'Poppins', sans-serif", fontWeight: 600,
              color: "rgb(255, 255, 255)",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            className="ProductTitle"
          >
            {selectedProduct?.title}
          </Typography>
          <MediaSelector/>
      </Box>
    );
  };

  const ProductList = () => {
    return (
      <Box
        sx={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start",
          height: "100%", width: "40%",
          overflowY: "scroll", "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          padding: "10px 0 10px 0", boxSizing: "border-box"
        }}
        ref={productListRef}
        onScroll={handleScroll}
        className="ProductList"
      >
        {products.map((product) => {
          return (
            <Box
              sx={{
                width: "100%", gap: "5%", minHeight: "80px", height: "80px",
                display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center",
                backgroundColor: (product.id === selectedProduct?.id) ? "rgba(255, 255, 255, 0.1)" : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  cursor: "pointer"
                },
                padding: "0 10px 0 10px", boxSizing: "border-box"
              }}
              key={product.id}
              className="ProductItem"
              onClick={() => {setSelectedProduct(product.id)}}
            >
              <Box
                component="img"
                src={product.images[0]?.src}
                sx={{
                  height: "60px",
                  width: "60px",
                  minWidth: "60px",
                  backgroundColor: "rgb(255, 255, 255)",
                  objectFit: "contain",
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "16px", },
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "normal",
                  color: "rgba(255, 255, 255, 0.83)",
                  textAlign: "left",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {product.title}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  const [ entityType, setEntityType ] = useState("PRODUCT");

  const ProductOrAssetButtons = () => {
    return (
      <Box
        sx={{
          display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
          width: "100%", height: "100px", gap: "25px",
          padding: "30px", boxSizing: "border-box",
          backgroundColor: "rgb(7, 7, 7)"
        }}
        className="ProductOrAsset"
      >
        <Button
          sx={{
            width: "40%", height: "100%", flexGrow: 1,
            padding: "10px", boxSizing: "border-box",
            borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: "solid", borderRadius: "0",
            fontFamily: "'Poppins', sans-serif", fontSize: "16px", 
            textTransform: "none",
            color: entityType === "PRODUCT" ? "white" : "rgb(77, 177, 255)",
            backgroundColor: entityType === "PRODUCT" ? "rgb(77, 177, 255)" : "transparent",
            "&:hover": {
              backgroundColor: entityType === "PRODUCT" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
              color: "white"
            }
          }}
          onClick={() => {
            if(entityType !== "PRODUCT") setEntityType("PRODUCT");
          }}
          className="ProductButton"
        >
          Products
        </Button>
        <Button
          sx={{
            width: "40%", height: "100%", flexGrow: 1,
            padding: "10px", boxSizing: "border-box",
            borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: "solid", borderRadius: "0",
            fontFamily: "'Poppins', sans-serif", fontSize: "16px", 
            textTransform: "none",
            color: entityType === "ASSET" ? "white" : "rgb(77, 177, 255)",
            backgroundColor: entityType === "ASSET" ? "rgb(77, 177, 255)" : "transparent",
            "&:hover": {
              backgroundColor: entityType === "ASSET" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
              color: "white"
            }
          }}
          onClick={() => {
            if(entityType !== "ASSET") setEntityType("ASSET");
          }}
          className="AssetButton"
        >
          Assets
        </Button>
      </Box>
    );
  }

  const SaveStoreButton = () => {
    return (
      <Button
        sx={{
          width: "100%",
          padding: "10px", boxSizing: "border-box",
          borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: "solid", borderRadius: "0",
          fontFamily: "'Poppins', sans-serif", fontSize: "16px",
          color: "white",
          backgroundColor: "rgb(77, 177, 255)",
        }}
        className="SaveStoreButton"
      >
        Save Store
      </Button>
    )
  }

  const ProductEditor = () => {
    return (
      <Box
        sx={{
          width: "100%", flexGrow: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
          overflowY: "scroll", scrollbarWidth: 0, "&::-webkit-scrollbar": { display: "none" }
        }}
        className="ProductEditor"
      >
        {products.map((product) => {
          return (
            <Box
              sx={{
                width: "100%", gap: "5%", minHeight: "80px", height: "80px",
                display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center",
                backgroundColor: (product.id === selectedProduct?.id) ? "rgba(255, 255, 255, 0.1)" : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  cursor: "pointer"
                },
                padding: "0 10px 0 10px", boxSizing: "border-box"
              }}
              key={product.id}
              className="ProductItem"
              onClick={() => {setSelectedProduct(product.id)}}
            >
              <Box
                component="img"
                src={product.images[0]?.src}
                sx={{
                  height: "60px",
                  width: "60px",
                  minWidth: "60px",
                  backgroundColor: "rgb(255, 255, 255)",
                  objectFit: "contain",
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "16px", },
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "normal",
                  color: "rgba(255, 255, 255, 0.83)",
                  textAlign: "left",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {product.title}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "30%", height: "100vh", 
        position: "fixed", left: 0,
        display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center",
        pointerEvents: "auto",
        backgroundColor: "rgb(0, 0, 0)"
      }}
      onClick={(event: React.MouseEvent<HTMLDivElement>) => { event.stopPropagation();}}
      className="CreatorKit"
    >
      <ProductOrAssetButtons/>
      <ProductEditor/>
      <SaveStoreButton/>
    </Box>
  );
};