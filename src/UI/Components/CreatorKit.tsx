import { Box, Typography } from "@mui/material";

import { useComponentStore } from "../../stores/ZustandStores";
import { useEffect, useRef } from "react";
import { ModelViewer } from "@shopify/hydrogen-react";

export const CreatorKit = () => {
  const { products, selectedProduct, setSelectedProduct, isCreatorKitOpen, openCreatorKit, closeCreatorKit } = useComponentStore();
  
  // For saving and retrieving scroll position from session storage
  const productListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (productListRef.current) {
      const storedScrollPosition = sessionStorage.getItem("productListScrollPosition");
      if (storedScrollPosition) {
        productListRef.current.scrollTop = parseFloat(storedScrollPosition);
      }
    }
  }, [isCreatorKitOpen, selectedProduct]);
  const handleScroll = () => {
    if (productListRef.current) {
      sessionStorage.setItem("productListScrollPosition", productListRef.current.scrollTop.toString());
    }
  };

  const ProductPane = () => {
    const MediaSelector = () => {
      const mediaTypes = ["Image", "Model_3D"];
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
                    selectedProduct?.images.map((image) => {
                      return (
                        <Box
                          component="img"
                          src={image.src}
                          sx={{
                            width: "150px", minWidth: "150px", aspectRatio: "1 / 1",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "10px"
                          }}
                          key={image.src}
                        />
                      );
                    })
                  }
                  {(mediaType.toUpperCase() === "MODEL_3D") &&
                    selectedProduct?.models.map((model) => {
                      
                      const modelData = {
                        id: model.id,
                        sources: [model.sources && model.sources[0]],
                        alt: "3D Model"
                      };
                      const iosSrc = model.sources && model.sources[1].url;
                      
                      return (                        
                        <Box
                          sx={{
                            width: "250px", minWidth: "250px", aspectRatio: "1 / 1",
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
                }
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

  return (
    <div
      style={{
        width: "70vw", height: "100vh", position: "fixed",
        display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center",
        pointerEvents: "auto",
        right: "100%", transform: isCreatorKitOpen ? "translateX(100%)" : "translateX(0)",
        transition: "transform 0.5s ease"
      }}
      onClick={(event: React.MouseEvent<HTMLDivElement>) => { event.stopPropagation();}}
      className="CreatorKitContainer"
    >
      <Box
        sx={{
          display: "flex", flexDirection: "row", width: "100%", height: "100%", alignItems: "center",
          backdropFilter: "blur(10px)", overflowX: "visible",
          position: "relative"
        }}
        className="CreatorKit"
      >
        <ProductList/>
        <ProductPane/>
        <Box
          component="img"
          src="icons/Arrow.svg"
          sx={{
            width: "30px", height: "120px",
            transform: isCreatorKitOpen? "rotate(180deg) translateY(50%)" : "translateY(-50%)",
            clipPath: isCreatorKitOpen? "polygon(0 20%, 100% 0%, 100% 100%, 0 80%)" : "polygon(0 0, 100% 20%, 100% 80%, 0 100%)",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            pointerEvents: "all",
            "&:hover": {
              cursor: "pointer",
            },
            position: "absolute", top: "50%", left: "100%"
          }}
          onClick={() => {
            if(!isCreatorKitOpen){
              openCreatorKit();
            }
            else {
              closeCreatorKit();
            }
          }}

          className="CreatorKitToggleButton"
        />
      </Box>
    </div>
  );
};