import { Box, Button, Checkbox, Typography } from "@mui/material";

import { useComponentStore, useEnvProductStore } from "../../stores/ZustandStores";
import { useEffect, useRef, useState } from "react";
import { ModelViewer } from "@shopify/hydrogen-react";

export const CreatorKit = () => {
  const { products, selectedProduct, setSelectedProduct } = useComponentStore();
  const { envProducts, modifyEnvProduct } = useEnvProductStore();

  const [ entityType, setEntityType ] = useState("PRODUCT");
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [toolType, setToolType] = useState<string>("MEDIA");

  const ProductOrAssetButtons = () => {
    return (
      <Box
        sx={{
          display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
          width: "100%", height: "100px", gap: "25px",
          padding: "30px", boxSizing: "border-box",
          backgroundColor: "rgb(15, 15, 15)"
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
    const productEditorRef = useRef<HTMLDivElement>(null);
    const productItemRefs = useRef<{[id: number]: HTMLSpanElement | null}>({});
  
    // Scroll
    const easeInOutCubic = (t: number) => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    const smoothScrollTo = (element: HTMLDivElement, to: number, duration: number) => {
      const start = element.scrollTop;
      const change = to - start;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        element.scrollTop = start + change * easeInOutCubic(progress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    };
    useEffect(() => {
      if (activeProductId && productItemRefs.current[activeProductId] && productEditorRef.current) {
        const container = productEditorRef.current;
        const element = productItemRefs.current[activeProductId];
        
        // Get the element's position relative to the container
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const relativeTop = elementRect.top - containerRect.top + container.scrollTop;

        // Add a small offset from the top if desired
        const offset = 0; // Adjust this value to change the final position
        
        // Animate the scroll with custom easing
        smoothScrollTo(container, relativeTop - offset, 800); // 800ms duration - adjust for faster/slower animation
      }
    }, [activeProductId]);

    const ProductPane = () => {
      const [mediaType, setMediaType] = useState("2D");

      // Auto compute Product pane height
      const [productPaneHeight, setProductPaneHeight] = useState<number>(0);
      useEffect(() => {
        setProductPaneHeight((productEditorRef.current?.clientHeight || 0) - (productItemRefs.current?.[products[0].id]?.clientHeight || 0));
      }, [productEditorRef.current?.clientHeight])
      if(!activeProductId) return null;

      const MediaTypeButtons = () => {
        return (
          <Box
            sx={{
              display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
              width: "100%", height: "100px", gap: "25px",
              padding: "30px", boxSizing: "border-box"
            }}
            className="MediaTypeButtons"
          >
            <Button
              sx={{
                width: "40%", height: "100%", flexGrow: 1,
                padding: "10px", boxSizing: "border-box",
                borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: "solid", borderRadius: "0",
                fontFamily: "'Poppins', sans-serif", fontSize: "16px", 
                textTransform: "none",
                color: mediaType === "2D" ? "white" : "rgb(77, 177, 255)",
                backgroundColor: mediaType === "2D" ? "rgb(77, 177, 255)" : "transparent",
                "&:hover": {
                  backgroundColor: mediaType === "2D" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
                  color: "white"
                }
              }}
              onClick={() => {
                if(mediaType !== "2D") setMediaType("2D");
              }}
              className="2DButton"
            >
              2D
            </Button>
            <Button
              sx={{
                width: "40%", height: "100%", flexGrow: 1,
                padding: "10px", boxSizing: "border-box",
                borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: "solid", borderRadius: "0",
                fontFamily: "'Poppins', sans-serif", fontSize: "16px", 
                textTransform: "none",
                color: mediaType === "3D" ? "white" : "rgb(77, 177, 255)",
                backgroundColor: mediaType === "3D" ? "rgb(77, 177, 255)" : "transparent",
                "&:hover": {
                  backgroundColor: mediaType === "3D" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
                  color: "white"
                }
              }}
              onClick={() => {
                if(mediaType !== "3D") setMediaType("3D");
              }}
              className="3DButton"
            >
              3D
            </Button>
          </Box>
        );
      }

      const createEnvProduct = (type: string, index: number) => {
        return;
      }

      const MediaContainer = () => {
        const product = products.find((product) => product.id === activeProductId);
        return (
          <Box
            sx={{
              width: "100%", display: "flex", flexGrow: 1,
              padding: "30px", paddingTop: 0, boxSizing: "border-box",
              overflow: "hidden"
            }}
            className="MediaContainer"
          >
            <Box
              sx={{
                display: "flex", flexDirection: "row", justifyContent: "center", alignItems: 'center',
                flexWrap: "wrap", gap: "20px", 
                width: "100%",
                overflowY: "scroll", scrollbarWidth: 0, "&::-webkit-scrollbar": {display: "none"},
              }}
              className="MediaItems"
            >
              {mediaType === "2D" &&
                product?.images.map((image, index) => {
                  return (
                    <Box
                      sx={{
                        maxWidth: "calc(50% - 20px)", flexGrow: 1,
                        display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center",
                        backgroundColor: (envProducts[product.id] && envProducts[product.id].imageIndex === index)?
                        "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
                        padding: "15px", boxSizing: "border-box",
                        gap: "20px",
                        "&:hover": {
                          backgroundColor: (envProducts[product.id] && envProducts[product.id].imageIndex === index)?
                          "rgba(255, 255, 255, 0.15)": "rgba(255, 255, 255, 0.075)",
                          cursor: "pointer"
                        }
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
                    </Box>
                  );
                })
              }
            </Box>
          </Box>
        );
      };
      
      return (
        <Box
          sx={{
            display: "flex", flexDirection: "column", alignItems: "center",
            width: "100%", height: `${productPaneHeight}px`,
            backgroundColor: "black",
          }}
          className="ProductPane"
        >
          {toolType === "MEDIA" &&
            <MediaTypeButtons/>
          }
          {toolType === "MEDIA" &&
            <MediaContainer/>
          }
        </Box>
      );
    };

    return (
      <Box
        sx={{
          width: "100%", flexGrow: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
          overflowY: "scroll", scrollbarWidth: 0, "&::-webkit-scrollbar": { display: "none" },
        }}
        ref={productEditorRef}
        className="ProductEditor"
      >
        {products.map((product) => {
          const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const envProduct = {
              id: product.id,
              isEnvironmentProduct: event.target.checked
            };
            modifyEnvProduct(product.id, envProduct);
            if(event.target.checked){
              setActiveProductId(product.id);
              setToolType("MEDIA");
            }
            else{
              setActiveProductId(null);
              setToolType("");
            }
          };

          return (
            <span 
              key={product.id}
              ref={el => productItemRefs.current[product.id] = el}
              style={{
                width: "100%"
            }}>
              <Box
                sx={{
                  width: "100%", gap: "5%", minHeight: "80px", height: "80px",
                  display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center",
                  backgroundColor: (envProducts[product.id]?.isEnvironmentProduct) ? "rgb(10, 10, 10)" : "rgb(5, 5, 5)",
                  padding: "0 15px 0 15px", boxSizing: "border-box"
                }}
                key={product.id}
                className="ProductItem"
              >
                <Checkbox
                  sx={{
                    background: "transparent",
                    color: "rgb(56, 56, 56)",
                    padding: 0,
                    borderRadius: 0,
                  }}
                  checked={envProducts[product.id]?.isEnvironmentProduct || false}
                  onChange={handleChange}
                  color={"primary"}
                />
                <Box
                  component="img"
                  src={product.images[0]?.src}
                  sx={{
                    height: "60px",
                    width: "60px",
                    minWidth: "60px",
                    backgroundColor: "rgb(255, 255, 255)",
                    objectFit: "contain",
                    opacity: (envProducts[product.id]?.isEnvironmentProduct) ? 1 : 0.5
                  }}
                />
                <Typography
                  sx={{
                    flexGrow: 1,
                    fontSize: { xs: "16px", },
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "normal",
                    color: (envProducts[product.id]?.isEnvironmentProduct) ? "rgba(255, 255, 255, 0.83)" : "rgba(255, 255, 255, 0.25)",
                    textAlign: "left",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {product.title}
                </Typography>
                <Box
                  component="img"
                  src="icons/Attach.svg"
                  sx={{
                    width: "20px", height: "20px",
                    opacity: (product.id === activeProductId  && toolType === "MEDIA") ? 1 : ((envProducts[product.id]?.isEnvironmentProduct) ? 0.5 : 0.2),
                    "&:hover": {
                      opacity: (envProducts[product.id]?.isEnvironmentProduct) ? 1 : 0.2,
                      cursor: (envProducts[product.id]?.isEnvironmentProduct) ? "pointer" : "arrow"
                    }
                  }}
                  onClick={() => {
                    if(envProducts[product.id]?.isEnvironmentProduct){
                      if(product.id === activeProductId){
                        if(toolType === "3DPARAMS"){
                          setToolType("MEDIA");
                        }
                        else{
                          setActiveProductId(null);
                          setToolType("");
                        }
                      }
                      else{
                        setActiveProductId(product.id);
                        setToolType("MEDIA");
                      }
                    }
                  }}
                />
                <Box
                  component="img"
                  src="icons/Cube.svg"
                  sx={{
                    width: "30px", height: "30px",
                    opacity: (product.id === activeProductId && toolType === "3DPARAMS") ? 1 : ((envProducts[product.id]?.isEnvironmentProduct) ? 0.5 : 0.2),
                    "&:hover": {
                      opacity: (envProducts[product.id]?.isEnvironmentProduct) ? 1 : 0.2,
                      cursor: (envProducts[product.id]?.isEnvironmentProduct) ? "pointer" : "arrow"
                    }
                  }}
                  onClick={() => {
                    if(envProducts[product.id]?.isEnvironmentProduct){
                      if(product.id === activeProductId){
                        if(toolType === "MEDIA"){
                          setToolType("3DPARAMS");
                        }
                        else{
                          setActiveProductId(null);
                          setToolType("");
                        }
                      }
                      else{
                        setActiveProductId(product.id);
                        setToolType("3DPARAMS");
                      }
                    }
                  }}
                />
              </Box>
              {activeProductId === product.id &&
                <ProductPane/>
              }
            </span>
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
      {entityType === "PRODUCT" && <ProductEditor/>}
      <SaveStoreButton/>
    </Box>
  );
};