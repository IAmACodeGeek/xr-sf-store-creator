import { Box, Button, Checkbox, Typography } from "@mui/material";

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

  // const ProductPane = () => {
  //   const MediaSelector = () => {
  //     const mediaTypes = ["Image", "Model_3D"];

  //     const createEnvProduct = (type: string, index: number) => {
  //       if(!selectedProduct) return;
  //       const envProduct = {
  //         id: selectedProduct.id,
  //         type: type,
  //         imageIndex: (type === "PHOTO" || type === "PSEUDO_3D")? index : undefined,
  //         modelIndex: (type === "MODEL_3D")? index : undefined,
  //         isEnvironmentProduct: true,
  //       };
  //       modifyEnvProduct(envProduct.id, envProduct);
  //     }

  //     return (
  //       <Box
  //         sx={{
  //           width: "100%",
  //           display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center",
  //           gap: "25px", marginTop: "20px",
  //         }}
  //         className="MediaSelector"
  //       >
  //         {mediaTypes.map((mediaType: string) => {
  //           return (
  //             <Box
  //               sx={{
  //                 width: "100%",
  //                 display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "flex-start",
  //                 gap: "10px",
  //               }}
  //               className="MediaOption"
  //               key={mediaType}
  //             >
  //               <Typography
  //                 sx={{
  //                   maxWidth: "100%", width: "100%",
  //                   overflowWrap: "break-word",
  //                   fontSize: "20px", fontFamily: "'Poppins', sans-serif",
  //                   color: "rgb(255, 255, 255)",
  //                 }}
  //               >
  //                 {mediaType}
  //               </Typography>
  //               <Box
  //                 sx={{
  //                   display: "flex", flexDirection: "row", justifyContent: "center", alignItems: 'center',
  //                   flexWrap: "wrap", gap: "20px", 
  //                   width: "100%"
  //                 }}
  //                 className="ListofValues"
  //               >
  //                 {(mediaType.toUpperCase() === "IMAGE") &&
  //                   selectedProduct?.images.map((image, index) => {
  //                     return (
  //                       <Box
  //                         sx={{
  //                           width: "180px", minWidth: "180px",
  //                           display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center",
  //                           backgroundColor: (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].imageIndex === index)?
  //                           "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.03)",
  //                           padding: "15px", boxSizing: "border-box",
  //                           gap: "20px"
  //                         }}
  //                         key={image.src}
  //                       >
  //                         <Box
  //                           component="img"
  //                           src={image.src}
  //                           sx={{
  //                             width: "100%", minWidth: "100%", aspectRatio: "1 / 1",
  //                             backgroundColor: "rgba(255, 255, 255, 0.075)",
  //                           }}
  //                         />
  //                         <Button
  //                           sx={{
  //                             width: "100%", minWidth: "100%",
  //                             backgroundColor: "#24a0ed", color: "white",
  //                             borderRadius: "0",
  //                             fontFamily: "'Poppins', sans-serif",
  //                             fontSize: "14px"
  //                           }}
  //                           disabled={
  //                             (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].type === "PHOTO") && 
  //                             (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].imageIndex === index)
  //                           }
  //                           className="UseAsPhotoButton"
  //                           onClick={() => {
  //                             createEnvProduct("PHOTO", index)
  //                           }}
  //                         >
  //                           Use as Photo
  //                         </Button>
  //                         <Button
  //                           sx={{
  //                             width: "100%", minWidth: "100%",
  //                             backgroundColor: "#24a0ed", color: "white",
  //                             borderRadius: "0",
  //                             fontFamily: "'Poppins', sans-serif", 
  //                             fontSize: "14px"
  //                           }}
  //                           className="Pseudo3dButton"
  //                           disabled={
  //                             (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].type === "PSEUDO_3D") &&
  //                             (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].imageIndex === index)
  //                           }
  //                           onClick={() => {
  //                             createEnvProduct("PSEUDO_3D", index)
  //                           }}
  //                         >
  //                           Pseudo 3D
  //                         </Button>
  //                       </Box>
  //                     );
  //                   })
  //                 }
  //                 {(mediaType.toUpperCase() === "MODEL_3D") &&
  //                   selectedProduct?.models.map((model, index) => {
                      
  //                     const modelData = {
  //                       id: model.id,
  //                       sources: [model.sources && model.sources[0]],
  //                       alt: "3D Model"
  //                     };
  //                     const iosSrc = model.sources && model.sources[1].url;
                      
  //                     return (
  //                       <Box
  //                         sx={{
  //                           width: "230px", minWidth: "230px",
  //                           display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center",
  //                           backgroundColor: "rgba(255, 255, 255, 0.05)",
  //                           padding: "15px", boxSizing: "border-box",
  //                           gap: "20px"
  //                         }}
  //                         key={model.id}
  //                       >                      
  //                         <Box
  //                           sx={{
  //                             width: "200px", minWidth: "200px", aspectRatio: "1 / 1",
  //                             "& model-viewer": {
  //                               "--poster-color": "transparent",
  //                               "--ar-button-display": "none !important",
  //                             }
  //                           }}
  //                         >
  //                           <ModelViewer
  //                             style={{
  //                               height: "100%",
  //                               width: "100%",
  //                             }}
  //                             data={modelData}
  //                             ar={true} 
  //                             arModes="scene-viewer webxr quick-look" 
  //                             arScale="auto" 
  //                             iosSrc={iosSrc} 
  //                             cameraControls={true} 
  //                             environmentImage="neutral" 
  //                             poster="" 
  //                             alt="A 3D model of a product"
  //                             onArStatus={(event: unknown) => console.log("AR Status:", event)} 
  //                             onLoad={() => console.log("Model loaded")} 
  //                           />
  //                         </Box>
  //                         <Button
  //                           sx={{
  //                             width: "100%", minWidth: "100%",
  //                             backgroundColor: "#24a0ed", color: "white",
  //                             borderRadius: "0",
  //                             fontFamily: "'Poppins', sans-serif", 
  //                             fontSize: "14px"
  //                           }}
  //                           disabled={
  //                             (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].type === "MODEL_3D") &&
  //                             (envProducts[selectedProduct.id] && envProducts[selectedProduct.id].modelIndex === index)
  //                           }
  //                           onClick={() => {
  //                             createEnvProduct("MODEL_3D", index)
  //                           }}
  //                         >
  //                           Use 3D Model
  //                         </Button>
  //                       </Box>
  //                     );
  //                   })
  //                 }
  //               </Box>
  //             </Box>
  //           );
  //         })}
  //       </Box>
  //     );
  //   };

  //   return (
  //     <Box
  //       sx={{
  //         display: "flex", flexDirection: "column", justifyContent: "start",
  //         height: "100%", width: "60%",
  //         overflowY: "scroll", "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none",
  //         backgroundColor: "rgba(0, 0, 0, 0.9)",
  //         padding: "20px", boxSizing: "border-box",
  //         borderRadius: "0 20px 20px 0"
  //       }}
  //       onScroll={handleScroll}
  //       ref={productPaneRef}
  //       className="ProductPane"
  //     >
  //       <Typography
  //           sx={{
  //             fontSize: "24px", fontFamily: "'Poppins', sans-serif", fontWeight: 600,
  //             color: "rgb(255, 255, 255)",
  //             textOverflow: "ellipsis",
  //             whiteSpace: "nowrap",
  //             overflow: "hidden",
  //           }}
  //           className="ProductTitle"
  //         >
  //           {selectedProduct?.title}
  //         </Typography>
  //         <MediaSelector/>
  //     </Box>
  //   );
  // };

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
                width: "100%", gap: "5%", height: "80px",
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
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
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
  
    // Cubic easing function for smoother animation
  const easeInOutCubic = (t: number) => {
    return t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Smooth scroll function with custom easing
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
              display: "flex", flexDirection: "row", justifyContent: "center", alignItems: 'center',
              flexWrap: "wrap", gap: "20px", 
              width: "100%"
            }}
            className="MediaItems"
          >
            {
              product?.images.map((image, index) => {
                return (
                  <Box
                    sx={{
                      width: "180px", minWidth: "180px",
                      display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center",
                      backgroundColor: (envProducts[product.id] && envProducts[product.id].imageIndex === index)?
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
                        (envProducts[product.id] && envProducts[product.id].type === "PHOTO") && 
                        (envProducts[product.id] && envProducts[product.id].imageIndex === index)
                      }
                      className="UseAsPhotoButton"
                      onClick={() => {
                        createEnvProduct("PHOTO", index)
                      }}
                    >
                      Use
                    </Button>
                  </Box>
                );
              })
            }
          </Box>
        );
      };
      
      return (
        <Box
          sx={{
            display: "flex", flexDirection: "column", alignItems: "center",
            width: "100%", height: `${productPaneHeight}px`,
            paddingBottom: "30px", boxSizing: "border-box",
            backgroundColor: "black",
            overflowY: "scroll", scrollbarWidth: 0, "&::-webkit-scrollbar": { display: "none" }, 
          }}
          className="ProductPane"
        >
          <MediaTypeButtons/>
          <MediaContainer/>
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
            setActiveProductId(null);
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
                  src="icons/Cube.svg"
                  sx={{
                    width: "30px", height: "30px",
                    opacity: product.id === activeProductId ? 1 : ((envProducts[product.id]?.isEnvironmentProduct) ? 0.5 : 0.2),
                    "&:hover": {
                      opacity: (envProducts[product.id]?.isEnvironmentProduct) ? 1 : 0.2,
                      cursor: (envProducts[product.id]?.isEnvironmentProduct) ? "pointer" : "arrow"
                    }
                  }}
                  onClick={() => {
                    if(envProducts[product.id]?.isEnvironmentProduct){
                      if(product.id !== activeProductId)
                        setActiveProductId(product.id)
                      else
                        setActiveProductId(null);
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