import { Box, Button, Card, CardContent, Checkbox, Typography, Input } from "@mui/material";
import {UploadFile} from "@mui/icons-material";
import { EnvProduct, useActiveProductStore, useComponentStore, useEnvProductStore, useToolStore } from "../../stores/ZustandStores";
import React, { useEffect, useRef, useState } from "react";
import { ModelViewer } from "@shopify/hydrogen-react";
import Product from "@/Types/Product";
import Swal from "sweetalert2";
import styles from "../UI.module.scss";
import { useGLTF } from "@react-three/drei";
import placeHolderData from "@/data/environment/placeHolderData/BigRoom";
import bigRoomPlaceHolderData from "@/data/environment/placeHolderData/BigRoom";
import { ALLOWED_MIME_TYPES, uploadAssetFiles } from "@/api/assetService";

export const CreatorKit = () => {
  const { products } = useComponentStore();
  const { envProducts, modifyEnvProduct } = useEnvProductStore();
  const {activeProductId, setActiveProductId} = useActiveProductStore();
  const {toolType, setToolType} = useToolStore();

  const [ entityType, setEntityType ] = useState<"PRODUCT" | "ASSET">("PRODUCT");
  const [mediaType, setMediaType] = useState<"2D" | "3D">("2D");
  const [paramsType, setParamsType] = useState<"CUSTOM" | "PLACEHOLDER">("CUSTOM");

  const FullWideButton: React.FC<{text: string, onClick?: () => void}> = ({text, onClick = () => {}}) => {
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
        onClick={onClick}
      >
        {text}
      </Button>
    )
  }

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
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, product: Product) => {
    if(event.target.checked && (envProducts[product.id]?.imageIndex === undefined) && (envProducts[product.id]?.modelIndex === undefined)){
      setToolType("MEDIA");
      setMediaType("2D");
      setActiveProductId(product.id);
      // Preload its models
      product.models.forEach((model) => {
        useGLTF.preload(model.sources?.[0].url || "");
      });
    }
    else{
      setActiveProductId(null);
      setToolType(null);
    }

    const envProduct = {
      id: product.id,
      isEnvironmentProduct: event.target.checked
    };
    modifyEnvProduct(product.id, envProduct);
  };

  // Product List
  const productListRef = useRef<HTMLDivElement>(null);
  const productItemRefs = useRef<{[id: number]: HTMLSpanElement | null}>({});

  // Scroll save
  const productListScroll = useRef<number>(0);
  useEffect(() => {
    const handleScroll = () => {
      if(productListRef.current){
        productListScroll.current = productListRef.current.scrollTop;
      }
    };

    const currentRef = productListRef.current;
    currentRef?.addEventListener("scroll", handleScroll);

    return () => {
      currentRef?.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Scroll load
  useEffect(() => {
    if(!activeProductId && productListRef.current){
      productListRef.current.scrollTop = productListScroll.current;
    }
  }, [activeProductId]);

  const ProductList = () => {
    return ( !activeProductId &&
      <Box
        sx={{
          width: "100%", flexGrow: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
          overflowY: "scroll", scrollbarWidth: 0, "&::-webkit-scrollbar": { display: "none" },
        }}
        ref={productListRef}
        className="ProductList"
      >
        {products.map((product) => {
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
                  onChange={(event) => {handleCheckboxChange(event, product)}}
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
                          setToolType(null);
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
                          setToolType(null);
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
            </span>
          );
        })}
      </Box>
    );
  }

  const ProductEditor = () => {
    const productEditorRef = useRef<HTMLDivElement>(null);
    const productItemRef = useRef<HTMLDivElement>(null);
    const product = products.find((product) => product.id === activeProductId);
    const envProduct = activeProductId? envProducts[activeProductId] : null;

    const ProductPane = () => {
      // Auto compute Product pane height
      const [productPaneHeight, setProductPaneHeight] = useState<number>(0);
      useEffect(() => {
        setProductPaneHeight((productEditorRef.current?.clientHeight || 0) - (productItemRef.current?.clientHeight || 0));
      }, []);
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

      const setMediaItem = (type: "MODEL_3D" | "PHOTO", index: number) => {
        if(!product) return;

        const envProduct: EnvProduct = {
          id: product.id,
          type: type,
          imageIndex: type === "PHOTO"? index : undefined,
          modelIndex: type === "MODEL_3D"? index: undefined,
          isEnvironmentProduct: true
        };

        modifyEnvProduct(product.id, envProduct);
      };

      const MediaContainer = () => {
        return (
          <Box
            sx={{
              width: "100%", display: "flex",
              padding: "30px", paddingTop: 0, boxSizing: "border-box",
              overflow: "hidden"
            }}
            className="MediaContainer"
          >
            <Box
              sx={{
                display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
                gap: "20px",
                width: "100%", minHeight: "100%",
                overflowY: "scroll", scrollbarWidth: 0, "&::-webkit-scrollbar": {display: "none"},
              }}
              className="MediaItems"
            >
              {mediaType === "2D" &&
                product?.images.map((image, index) => {
                  return (
                    <Box
                      sx={{
                        width: "calc(50% - 10px)", aspectRatio: "1 / 1",
                        display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center",
                        backgroundColor: (envProduct?.imageIndex === index)?
                        "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.03)",
                        border: (envProduct?.imageIndex === index)? "2px solid #4cb1ff" : "none",
                        padding: "15px", boxSizing: "border-box",
                        "&:hover": {
                          backgroundColor: (envProduct?.imageIndex === index)?
                          "rgba(255, 255, 255, 0.1)": "rgba(255, 255, 255, 0.075)",
                          cursor: "pointer"
                        }
                      }}
                      key={index}
                      onClick={() => {
                        setMediaItem("PHOTO", index);
                      }}
                    >
                      <Box
                        component="img"
                        src={image.src}
                        sx={{
                          width: "100%", aspectRatio: "1 / 1",
                          backgroundColor: "rgba(255, 255, 255, 0.075)",
                        }}
                      />
                    </Box>
                  );
                })
              }
              {mediaType === "3D" &&
                product?.models.map((model, index) => {
                  const modelData = {
                    id: model.id,
                    sources: [model.sources && model.sources[0]],
                    alt: "3D Model"
                  };
                  const iosSrc = model.sources && model.sources[1].url;

                  return (
                    <Box
                      sx={{
                        width: "80%", aspectRatio: "1 / 1",
                        display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "center",
                        backgroundColor: (envProduct?.modelIndex === index)?
                        "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.03)",
                        border: (envProduct?.modelIndex === index)? "2px solid #4cb1ff" : "none",
                        padding: "25px", boxSizing: "border-box",
                      }}
                      key={index}
                    >
                      <ModelViewer
                        style={{
                          minWidth: "100%", width: "100%", minHeight: "100%", height: "100%",
                          backgroundColor: "rgb(15, 15, 15)"
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
                      />
                      <FullWideButton text="Use This Model" onClick={() => {
                        setMediaItem("MODEL_3D", index);
                      }}/>
                    </Box>
                  );
                })
              }
            </Box>
          </Box>
        );
      };

      const ParamsTypeButtons = () => {
        return (
          <Box
            sx={{
              display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
              width: "100%", height: "100px", gap: "25px",
              padding: "30px", boxSizing: "border-box",
              backgroundColor: "rgb(5, 5, 5)"
            }}
            className="ParamsTypeButtons"
          >
            <Button
              sx={{
                width: "40%", height: "100%", flexGrow: 1,
                padding: "10px", boxSizing: "border-box",
                borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: "solid", borderRadius: "0",
                fontFamily: "'Poppins', sans-serif", fontSize: "14px",
                color: paramsType === "CUSTOM" ? "white" : "rgb(77, 177, 255)",
                backgroundColor: paramsType === "CUSTOM" ? "rgb(77, 177, 255)" : "transparent",
                "&:hover": {
                  backgroundColor: paramsType === "CUSTOM" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
                  color: "white"
                }
              }}
              onClick={() => {
                if(!envProduct) return;
                if(paramsType !== "CUSTOM") setParamsType("CUSTOM");
                
                const newEnvProduct: EnvProduct = {
                  id: envProduct.id,
                  placeHolderId: undefined,
                  isEnvironmentProduct: true
                };

                if(envProduct.placeHolderId){
                  const placeHolderData = bigRoomPlaceHolderData.find((data) => data.id === envProduct.placeHolderId);
                  newEnvProduct.position = placeHolderData?.position;
                  newEnvProduct.rotation = placeHolderData?.rotation;
                  newEnvProduct.scale = placeHolderData?.scale;
                }
                modifyEnvProduct(envProduct.id, newEnvProduct);
              }}
              className="CustomButton"
            >
              Custom
            </Button>
            <Button
              sx={{
                width: "40%", height: "100%", flexGrow: 1,
                padding: "10px", boxSizing: "border-box",
                borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: "solid", borderRadius: "0",
                fontFamily: "'Poppins', sans-serif", fontSize: "14px",
                color: paramsType === "PLACEHOLDER" ? "white" : "rgb(77, 177, 255)",
                backgroundColor: paramsType === "PLACEHOLDER" ? "rgb(77, 177, 255)" : "transparent",
                "&:hover": {
                  backgroundColor: paramsType === "PLACEHOLDER" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
                  color: "white"
                }
              }}
              onClick={() => {
                if(paramsType !== "PLACEHOLDER") setParamsType("PLACEHOLDER");
              }}
              className="PlaceHolderButton"
            >
              PlaceHolder
            </Button>
          </Box>
        );
      }

      const ThreeParamsEditor = () => {
        const getValue = (parameter: "POSITION" | "ROTATION" | "SCALE", axis?: string) => {
          if(parameter === "POSITION" && axis){
            if(axis.toUpperCase() === "X") return envProduct?.position?.[0];
            else if(axis.toUpperCase() === "Y") return envProduct?.position?.[1];
            else if(axis.toUpperCase() === "Z") return envProduct?.position?.[2];
          }
          else if(parameter === "ROTATION" && axis){
            if(axis.toUpperCase() === "X") return envProduct?.rotation?.[0];
            else if(axis.toUpperCase() === "Y") return envProduct?.rotation?.[1];
            else if(axis.toUpperCase() === "Z") return envProduct?.rotation?.[2];
          }
          else if(parameter === "SCALE"){
            return envProduct?.scale;
          }
          return null;
        };

        const setValue = (parameter: "POSITION" | "ROTATION" | "SCALE", value: number, axis?: string) => {
          if(!envProduct) return;

          const newEnvProduct: EnvProduct = {
            id: envProduct.id,
            isEnvironmentProduct: true
          };

          if(parameter === "POSITION" && axis && envProduct.position){
            if(axis.toUpperCase() === "X") {
              newEnvProduct.position = [value, envProduct.position[1], envProduct.position[2]];
            }
            else if(axis.toUpperCase() === "Y") {
              newEnvProduct.position = [envProduct.position[0], value, envProduct.position[2]];
            }
            else if(axis.toUpperCase() === "Z") {
              newEnvProduct.position = [envProduct.position[0], envProduct.position[1], value];
            }
          }
          else if(parameter === "ROTATION" && axis && envProduct.rotation){
            if(axis.toUpperCase() === "X") {
              newEnvProduct.rotation = [value, envProduct.rotation[1], envProduct.rotation[2]];
            }
            else if(axis.toUpperCase() === "Y") {
              newEnvProduct.rotation = [envProduct.rotation[0], value, envProduct.rotation[2]];
            }
            else if(axis.toUpperCase() === "Z") {
              newEnvProduct.rotation = [envProduct.rotation[0], envProduct.rotation[1], value];
            }
          }
          else if(parameter === "SCALE"){
            newEnvProduct.scale = value;
          }

          modifyEnvProduct(envProduct.id, newEnvProduct);
        };

        const ParameterEntry = (type: "POSITION" | "ROTATION" | "SCALE", defaultValue: number, axis?: string) => {
          return (
            <Box
              sx={{
                display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "start"
              }}
              key={type+axis}
            >
              <Typography
                sx={{
                  fontSize: "20px", fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
                  color: "white",
                  textAlign: "left",
                  marginRight: "20px",
                }}
              >
                {axis} :
              </Typography>
              <input type="number"
                defaultValue={defaultValue}
                style={{
                  height: "40px", padding: "5px", boxSizing: "border-box",
                  fontSize: "18px", fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
                  background: "transparent", color: "white",
                  border: "2px solid #41cbff", borderRadius: 0, appearance: "none",
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.border = '2px solid #41cbff';
                }}
                onBlur={(e) => {setValue(type, Math.round(Number(e.target.value) * 1000) / 1000, axis)}}
              />
            </Box>
          );
        };

        const ThreeAxisParameterBox = (type: "POSITION" | "ROTATION" | "SCALE") => {
          return (
            <Box
              sx={{
                width: "100%", padding: "0 30px 0 30px", boxSizing: "border-box",
                display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center", gap: "20px",
              }}
              className={type}
            >
              <Typography
                sx={{
                  width: "100%",
                  fontSize: { xs: "20px", }, fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
                  color: "white",
                  textAlign: "left"
                }}
              >
                {type}
              </Typography>
              {type !== "SCALE" &&
                ["X", "Y", "Z"].map((axis: string) => {
                  return ParameterEntry(type, getValue(type, axis) || 0, axis);
                })
              }
              {type === "SCALE" &&
                ParameterEntry(type, getValue("SCALE") || 1, "U")
              }
            </Box> 
          );
        };

        const CustomParamterEntries = () => {
          return (
            <Box
              sx={{
                width: "100%",  
                display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center", gap: "40px",
              }}
              className="Parameters"
            >
              {ThreeAxisParameterBox("POSITION")}
              {ThreeAxisParameterBox("ROTATION")}
              {ThreeAxisParameterBox("SCALE")}
            </Box>
          );
        };

        const PlaceHolderEditor = () => {
          const placeHolderItemRefs = useRef<{[id: number]: HTMLSpanElement | null}>({});
          return (
            <Box
              sx={{
                display: "flex", flexDirection: "column",
                width: "100%"
              }}
              className="PlaceHolderEditor"
            >
              {placeHolderData.map((placeHolderItem) => {
                const placeHolderEnvProduct = Object.values(envProducts).find((envProduct: EnvProduct) => envProduct.placeHolderId === placeHolderItem.id);
                return (
                  <span 
                    key={placeHolderItem.id}
                    ref={el => placeHolderItemRefs.current[placeHolderItem.id] = el}
                    style={{
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%", gap: "5%", minHeight: "80px", height: "80px",
                        display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center",
                        backgroundColor: envProduct?.placeHolderId === placeHolderItem.id ? "rgb(10, 10, 10)" : "rgb(5, 5, 5)",
                        padding: "0 30px 0 30px", boxSizing: "border-box"
                      }}
                      className="PlaceHolderBox"
                    >
                      <Typography
                        sx={{
                          background: "transparent",
                          color: envProduct?.placeHolderId === placeHolderItem.id ? "rgba(255, 255, 255, 0.83)" : "rgba(255, 255, 255, 0.25)",
                          padding: 0,
                          borderRadius: 0,
                        }}
                      >
                        {placeHolderItem.id}
                      </Typography>
                      <Typography
                        sx={{
                          flexGrow: 1,
                          fontSize: { xs: "16px", },
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: "normal",
                          color: envProduct?.placeHolderId === placeHolderItem.id ? "rgba(255, 255, 255, 0.83)" : "rgba(255, 255, 255, 0.25)",
                          textAlign: "left",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          paddingLeft: "10px",
                        }}
                      >
                        {products.find((product) => product.id === placeHolderEnvProduct?.id)?.title || ". . . . . ."}
                      </Typography>
                      <Button
                        sx={{
                          minWidth: "30%", height: "40px",
                          padding: "10px", boxSizing: "border-box",
                          borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: "solid", borderRadius: "0",
                          fontFamily: "'Poppins', sans-serif", fontSize: "14px",
                          color: "white",
                          backgroundColor: "rgb(77, 177, 255)",
                          "&:hover": {
                            backgroundColor: "rgb(109, 192, 255)",
                          }
                        }}
                        disabled={placeHolderEnvProduct !== undefined}
                        onClick={() => {
                          if(!envProduct) return;
                          const newEnvProduct: EnvProduct = {
                            id: envProduct.id,
                            isEnvironmentProduct: true,
                            placeHolderId: placeHolderItem.id
                          }
                          modifyEnvProduct(envProduct?.id, newEnvProduct);
                        }}
                        className="UsePlaceHolderButton"
                      >
                        {placeHolderEnvProduct === undefined ? "Use" : "In Use"}
                      </Button>
                    </Box>
                  </span>
                );
              })}
            </Box>
          );
        }

        return (
          <Box
            sx={{
              width: "100%", display: "flex", flexDirection: "column",
              paddingBottom: "30px"
            }}
            className="ThreeParamsContainer"
          >
            { paramsType === "CUSTOM" &&
              <CustomParamterEntries/>
            }
            { paramsType === "PLACEHOLDER" &&
              <PlaceHolderEditor/>
            }
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
            <MediaContainer />
          }
          {toolType === "3DPARAMS" && 
            <ParamsTypeButtons/>
          }
          {toolType === "3DPARAMS" && 
            <ThreeParamsEditor/>
          }
        </Box>
      );
    };

    return ( product &&
      <Box
        sx={{
          width: "100%", flexGrow: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
          overflowY: "scroll", scrollbarWidth: 0, "&::-webkit-scrollbar": { display: "none" },
        }}
        ref={productEditorRef}
        className="ProductEditor"
      >
        <Box
          sx={{
            width: "100%", gap: "5%", minHeight: "80px", height: "80px",
            display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center",
            backgroundColor: (envProduct?.isEnvironmentProduct) ? "rgb(10, 10, 10)" : "rgb(5, 5, 5)",
            padding: "0 15px 0 15px", boxSizing: "border-box"
          }}
          className="ProductItem"
        >
          <Checkbox
            sx={{
              background: "transparent",
              color: "rgb(56, 56, 56)",
              padding: 0,
              borderRadius: 0,
            }}
            checked={envProduct?.isEnvironmentProduct || false}
            onChange={(event) => {handleCheckboxChange(event, product)}}
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
              opacity: (envProduct?.isEnvironmentProduct) ? 1 : 0.5
            }}
          />
          <Typography
            sx={{
              flexGrow: 1,
              fontSize: { xs: "16px", },
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "normal",
              color: (envProduct?.isEnvironmentProduct) ? "rgba(255, 255, 255, 0.83)" : "rgba(255, 255, 255, 0.25)",
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
              opacity: (product.id === activeProductId && toolType === "MEDIA") ? 1 : ((envProduct?.isEnvironmentProduct) ? 0.5 : 0.2),
              "&:hover": {
                opacity: (envProduct?.isEnvironmentProduct) ? 1 : 0.2,
                cursor: (envProduct?.isEnvironmentProduct) ? "pointer" : "arrow"
              }
            }}
            onClick={() => {
              if(product.id === activeProductId && toolType !== "MEDIA"){
                setToolType("MEDIA");
              }
            }}
          />
          <Box
            component="img"
            src="icons/Cube.svg"
            sx={{
              width: "30px", height: "30px",
              opacity: (product.id === activeProductId && toolType === "3DPARAMS") ? 1 : ((envProduct?.isEnvironmentProduct) ? 0.5 : 0.2),
              "&:hover": {
                opacity: (envProduct?.isEnvironmentProduct) ? 1 : 0.2,
                cursor: (envProduct?.isEnvironmentProduct) ? "pointer" : "arrow"
              }
            }}
            onClick={() => {
              if(envProduct?.isEnvironmentProduct){
                if(product.id === activeProductId && toolType !== "3DPARAMS"){
                  if((envProduct.imageIndex !== undefined) || (envProduct.modelIndex !== undefined)){
                    setToolType("3DPARAMS");
                  }
                  else{
                    Swal.fire({
                      title: "No Asset Selected",
                      text: "Please select one of the provided 2D or 3D assets before proceeding.",
                      icon: "warning",
                      showConfirmButton: true,
                      allowOutsideClick: false,
                      customClass: {
                        title: styles.swalTitle,
                        popup: styles.swalPopup,
                      },
                    });
                  }
                } 
              }
            }}
          />
        </Box>
        <ProductPane/>
      </Box>
    );
  };

  const FileSelector = () => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(true);
    };
  
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
    };
  
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
  
      const droppedFiles = Array.from(event.dataTransfer.files || []);
      const validFiles = droppedFiles.filter((file: File) => ALLOWED_MIME_TYPES.includes(file.type));
      if(validFiles.length !== droppedFiles.length){
        console.error('Invalid Files Present');
        return;
      }
      await uploadAssetFiles('deltaxrstore.myshopify.com', validFiles);
    };
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      const validFiles = selectedFiles.filter((file: File) => ALLOWED_MIME_TYPES.includes(file.type));
      
      if (validFiles.length !== selectedFiles.length) {
        console.error('Invalid Files Present');
        return;
      }
      
      await uploadAssetFiles('deltaxrstore.myshopify.com', validFiles);
      
      // Clear the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <Box
        sx={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          width: "calc(100% - 60px)", marginLeft: "30px", marginRight: "30px",
          height: "220px",
          border: "4px dashed rgb(77, 177, 255)",
          '&:hover': {
            cursor: "pointer"
          }
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
          accept={ALLOWED_MIME_TYPES.join(',')}
          multiple
          style={{ display: 'none' }}
        />
        <Box
          component="img"
          src="icons/Upload.svg"
          sx={{
            width: "100px",
            opacity: 0.3,
          }}
        >
        </Box>
        <Typography
          sx={{
            color: "rgb(77, 177, 255)"
          }}
        >
          Upload Files
        </Typography>
        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.39)",
            fontSize: "14px",
          }}
        >
          {"(.jpg, .jpeg, .png, .svg, .glb)"}
        </Typography>
      </Box>
    );
  };

  // Assets List
  const assetListRef = useRef<HTMLDivElement>(null);
  const assetListItemRef = useRef<{[id: number]: HTMLSpanElement | null}>({});
  const AssetList = () => {
    return (
      null
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
      {entityType === "PRODUCT" && <ProductList/>}
      {entityType === "PRODUCT" && <ProductEditor/>}
      {entityType === "ASSET" && <FileSelector/>}
      {entityType === "ASSET" && <AssetList/>}
      {!activeProductId && <FullWideButton text={"Save Store"}/>}
      {activeProductId && 
        <FullWideButton text={"Done"} 
          onClick={() => {
            if(!envProducts[activeProductId]) return null;

            if((envProducts[activeProductId].imageIndex !== undefined) || (envProducts[activeProductId].modelIndex !== undefined)){
              setActiveProductId(null);
            }
            else{
              Swal.fire({
                title: "No Asset Selected",
                text: "Please select one of the provided 2D or 3D assets before proceeding.",
                icon: "warning",
                showConfirmButton: true,
                allowOutsideClick: false,
                customClass: {
                  title: styles.swalTitle,
                  popup: styles.swalPopup,
                },
              });
            }
          }}
        />
      }
    </Box>
  );
};