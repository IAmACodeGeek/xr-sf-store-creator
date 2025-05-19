import { Box, Button, Checkbox, Typography } from "@mui/material";
import { EnvProduct, useComponentStore, useEnvProductStore, useToolStore, useEnvAssetStore, EnvAsset, useBrandStore } from "../../stores/ZustandStores";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModelViewer } from "@shopify/hydrogen-react";
import Product from "@/Types/Product";
import Swal from "sweetalert2";
import styles from "../UI.module.scss";
import { useGLTF } from "@react-three/drei";
import environmentData from "@/data/environment/EnvironmentData";
import { ALLOWED_MIME_TYPES, AssetService, ERROR_CODES } from "@/api/assetService";
import EnvStoreService from "@/api/envStoreService";
import {showPremiumPopup} from './PremiumRequired';

export const CreatorKit = () => {
  const { products } = useComponentStore();
  const {envAssets, modifyEnvAsset, setEnvAssets, activeAssetId, setActiveAssetId} = useEnvAssetStore();
  const { envProducts, modifyEnvProduct, activeProductId, setActiveProductId } = useEnvProductStore();
  const {toolType, setToolType} = useToolStore();
  const {brandData} = useBrandStore();

  const [ entityType, setEntityType ] = useState<"PRODUCT" | "ASSET">("PRODUCT");
  const [mediaType, setMediaType] = useState<"PHOTO" | "MODEL_3D">("PHOTO");
  const [paramsType, setParamsType] = useState<"CUSTOM" | "PLACEHOLDER">("CUSTOM");
  const [assetSource, setAssetSource] = useState<"LIBRARY" | "OWN">("LIBRARY");

  const [envProduct, setEnvProduct] = useState<EnvProduct | undefined>(undefined); 
  const [envAsset, setEnvAsset] = useState<EnvAsset | undefined>(undefined);

  // Load Placeholder data
  const placeHolderData = useMemo(() => {
    if(!brandData) return null;
    return environmentData[brandData?.environment_name.toUpperCase()].placeHolderData;
  }, [brandData]);

  // For component reload logic
  const threeParamsEntry = useRef<null | string>(null);
  const threeParamsSlider = useRef<null | string>(null);

  useEffect(() => {
    if(entityType === "PRODUCT" && activeProductId !== null) {
      setEnvProduct(envProducts[activeProductId]);
      setEnvAsset(undefined);
    }
    else if(entityType === "ASSET" && activeAssetId !== null) {
      setEnvAsset(envAssets[activeAssetId]);
      setEnvProduct(undefined);
    }
  }, [activeAssetId, activeProductId, entityType, envAssets, envProducts]);

  const FullWideButton: React.FC<{text: string, onClick?: () => void}> = ({text, onClick = () => {}}) => {
    return (
      <Button
        sx={{
          width: "100%",
          padding: "10px", boxSizing: "border-box",
          borderRadius: "0",
          fontFamily: "'Poppins', sans-serif", fontSize: "16px",
          color: "white",
          background: "linear-gradient(135deg, #8458FB, #6A6CEC, #4D82DC, #3098CB, #17ABBD)"
        }}
        className="FullWideButton"
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
          width: "100%", height: "100px", minHeight: "100px", gap: "25px",
          padding: "30px", boxSizing: "border-box",
          backgroundColor: "rgb(15, 15, 15)"
        }}
        className="ProductOrAsset"
      >
        <Button
          sx={{
            width: "40%", height: "100%", flexGrow: 1,
            padding: "10px", boxSizing: "border-box",
            fontFamily: "'Poppins', sans-serif", fontSize: "16px", 
            textTransform: "none",
            color: entityType === "PRODUCT" ? "white" : "rgb(77, 177, 255)",
            background: entityType === "PRODUCT" ? "linear-gradient(135deg, #8458FB, #6A6CEC, #4D82DC, #3098CB, #17ABBD)" : "transparent",
            borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: entityType === "PRODUCT" ? "none" : "solid", borderRadius: "0",
            "&:hover": {
              backgroundColor: entityType === "PRODUCT" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
              color: "white"
            }
          }}
          onClick={() => {
            if(activeAssetId !== null) setActiveAssetId(null);
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
            fontFamily: "'Poppins', sans-serif", fontSize: "16px", 
            textTransform: "none",
            color: entityType === "ASSET" ? "white" : "rgb(77, 177, 255)",
            background: entityType === "ASSET" ? "linear-gradient(135deg, #8458FB, #6A6CEC, #4D82DC, #3098CB, #17ABBD)" : "transparent",
            borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: entityType === "ASSET" ? "none" : "solid", borderRadius: "0",
            "&:hover": {
              backgroundColor: entityType === "ASSET" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
              color: "white"
            }
          }}
          onClick={() => {
            if(activeProductId !== null) setActiveProductId(null); 
            if(entityType !== "ASSET") {
              setEntityType("ASSET");
              setParamsType('CUSTOM');
            }
          }}
          className="AssetButton"
        >
          Assets
        </Button>
      </Box>
    );
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, parameters: {productId?: number, assetId?: string}) => {
    if(entityType === "PRODUCT"){
      const product: Product | undefined = products.find((product) => product.id === parameters.productId);
      if(!product) return;

      if(event.target.checked){
        // Check if the number of products with this new one is <= 20
        if(Object.values(envProducts).filter((envProduct) => envProduct.isEnvironmentProduct).length >= 20){
          showPremiumPopup("Your current plan supports up to 20 products. Reach out to our sales team to unlock more exclusive options.");
          return;
        }
        // Check if there are more than 5 product models
        if(
          Object.values(envProducts).find((envProduct) => envProduct.id === parameters.productId)?.type === "MODEL_3D" && 
          Object.values(envProducts).filter((envProduct) => envProduct.type === "MODEL_3D" && envProduct.isEnvironmentProduct).length >=5){
            showPremiumPopup("Your current plan supports only up to 5 product models. Reach out to our sales team to unlock more exclusive options.");
            return;
          }
      }

      const isProductFirstTime = (envProducts[product.id]?.imageIndex === undefined) && (envProducts[product.id]?.modelIndex === undefined);
      if(event.target.checked && isProductFirstTime){
        setToolType("MEDIA");
        setMediaType("PHOTO");
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
      const envProduct = Object.values(envProducts).find((envProduct) => envProduct.id === product.id);
      
      const newEnvProduct: EnvProduct = {
        id: product.id,
        isEnvironmentProduct: event.target.checked,
        imageIndex: isProductFirstTime? 0 : envProduct?.imageIndex
      };
      modifyEnvProduct(product.id, newEnvProduct);
    }
    else if(entityType === "ASSET"){
      const envAsset = envAssets[parameters.assetId || -1];
      if(event.target.checked){
        if(Object.values(envAssets).filter((envAsset) => envAsset.isEnvironmentAsset).length >= 5){
          showPremiumPopup("Your current plan supports only up to 5 assets. Reach out to our sales team to unlock more exclusive options.");
          return;
        }

        setActiveAssetId(envAsset.id);
        // Preload its models
        if(envAsset.type === 'MODEL_3D'){
          useGLTF.preload(envAsset.src);
        }
      }
      else{
        setActiveAssetId(null);
      }
  
      envAsset.isEnvironmentAsset = event.target.checked;
      modifyEnvAsset(envAsset.id, envAsset);
    }
  }

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
            fontFamily: "'Poppins', sans-serif", fontSize: "14px",
            color: paramsType === "CUSTOM" ? "white" : "rgb(77, 177, 255)",
            background: paramsType === "CUSTOM" ? "linear-gradient(135deg, #8458FB, #6A6CEC, #4D82DC, #3098CB, #17ABBD)" : "transparent",
            borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: paramsType === "CUSTOM" ? "none" : "solid", borderRadius: "0",
            "&:hover": {
              backgroundColor: paramsType === "CUSTOM" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
              color: "white"
            }
          }}
          onClick={() => {
            if(entityType === "PRODUCT" && envProduct){
              if(paramsType !== "CUSTOM") setParamsType("CUSTOM");
              
              const newEnvProduct: EnvProduct = {
                id: envProduct.id,
                placeHolderId: undefined,
                isEnvironmentProduct: true
              };
  
              if(envProduct.placeHolderId !== undefined && placeHolderData){
                const placeHolder = placeHolderData.find((placeHolder) => placeHolder.id === envProduct.placeHolderId);
                newEnvProduct.position = placeHolder?.position;
                newEnvProduct.rotation = placeHolder?.rotation;
                newEnvProduct.scale = placeHolder?.scale;
              }
              modifyEnvProduct(envProduct.id, newEnvProduct);
            }
          }}
          className="CustomButton"
        >
          Custom
        </Button>
        <Button
          sx={{
            width: "40%", height: "100%", flexGrow: 1,
            padding: "10px", boxSizing: "border-box",
            fontFamily: "'Poppins', sans-serif", fontSize: "14px",
            color: paramsType === "PLACEHOLDER" ? "white" : "rgb(77, 177, 255)",
            background: paramsType === "PLACEHOLDER" ? "linear-gradient(135deg, #8458FB, #6A6CEC, #4D82DC, #3098CB, #17ABBD)" : "transparent",
            borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: paramsType === "PLACEHOLDER" ? "none" : "solid", borderRadius: "0",
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

  // 3D positioning of assets and products
  const ThreeParamsEditor = () => {
    // Detect Enter key press for inputs
    useEffect(() => {
      const handleEnterEvent = (event: Event) => {
        if((event as KeyboardEvent).key === "Enter" && document.activeElement){
          (document.activeElement as HTMLInputElement).blur();
        }
      };

      document.getElementsByClassName("CreatorKit")[0].addEventListener('keydown', handleEnterEvent);
      
      return () => {
        document.getElementsByClassName("CreatorKit")[0].removeEventListener('keydown', handleEnterEvent);
      }
    }, []);

    if(activeAssetId === null && activeProductId === null) return null;

    const getValue = (parameter: "POSITION" | "ROTATION" | "SCALE", axis?: string) => {
      if(entityType === "PRODUCT"){
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
      }
      else if(entityType === "ASSET"){
        if(parameter === "POSITION" && axis){
          if(axis.toUpperCase() === "X") return envAsset?.position?.[0];
          else if(axis.toUpperCase() === "Y") return envAsset?.position?.[1];
          else if(axis.toUpperCase() === "Z") return envAsset?.position?.[2];
        }
        else if(parameter === "ROTATION" && axis){
          if(axis.toUpperCase() === "X") return envAsset?.rotation?.[0];
          else if(axis.toUpperCase() === "Y") return envAsset?.rotation?.[1];
          else if(axis.toUpperCase() === "Z") return envAsset?.rotation?.[2];
        }
        else if(parameter === "SCALE"){
          return envAsset?.scale;
        }
      }
      return undefined;
    };

    const setValue = (parameter: "POSITION" | "ROTATION" | "SCALE", value: number, axis?: string) => {
      if(entityType === "PRODUCT" && envProduct){
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
      }
      else if(entityType === "ASSET" && envAsset){
        const newEnvAsset: EnvAsset = {
          id: envAsset.id,
          isEnvironmentAsset: true,
          type: envAsset.type,
          status: envAsset.status,
          src: envAsset.src,
          name: envAsset.name,
          source: envAsset.source
        };
  
        if(parameter === "POSITION" && axis && envAsset.position){
          if(axis.toUpperCase() === "X") {
            newEnvAsset.position = [value, envAsset.position[1], envAsset.position[2]];
          }
          else if(axis.toUpperCase() === "Y") {
            newEnvAsset.position = [envAsset.position[0], value, envAsset.position[2]];
          }
          else if(axis.toUpperCase() === "Z") {
            newEnvAsset.position = [envAsset.position[0], envAsset.position[1], value];
          }
        }
        else if(parameter === "ROTATION" && axis && envAsset.rotation){
          if(axis.toUpperCase() === "X") {
            newEnvAsset.rotation = [value, envAsset.rotation[1], envAsset.rotation[2]];
          }
          else if(axis.toUpperCase() === "Y") {
            newEnvAsset.rotation = [envAsset.rotation[0], value, envAsset.rotation[2]];
          }
          else if(axis.toUpperCase() === "Z") {
            newEnvAsset.rotation = [envAsset.rotation[0], envAsset.rotation[1], value];
          }
        }
        else if(parameter === "SCALE"){
          newEnvAsset.scale = value;
        }
  
        modifyEnvAsset(envAsset.id, newEnvAsset);
      }
    };

    interface ParameterInputProps {
      type: "POSITION" | "ROTATION" | "SCALE";
      defaultValue: number;
      axis?: string;
    }
    const ParameterInput = ({type, defaultValue, axis}: ParameterInputProps) => {
      const inputRef = useRef<HTMLInputElement>(null);
      const autoFocus = useMemo(() => {
        if(!threeParamsEntry.current) return false;
        const savedThreeParamsEntry = threeParamsEntry.current.split(' ');
        if(savedThreeParamsEntry[0] === type){
          if(type !== 'SCALE' && axis === savedThreeParamsEntry[1]){
            return true;
          }
          else if(type === 'SCALE'){
            return true;
          }
        }
        return false;
      }, [type, axis]);

      return (
        <div
          style={{
            height: "40px", width: "85%", padding: "5px", boxSizing: "border-box",
            border: "2px solid #41cbff", borderRadius: 0,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <Button
            style={{
              height: "34px", minWidth: "34px", width: "34px", padding: 0,
              fontSize: "24px", fontWeight: "bold", color: "white"
            }}
            onClick={() => {
              let value = Number((inputRef.current as HTMLInputElement).value);
              if(type !== 'ROTATION'){
                value -= 0.1;
              }
              else{
                value -= 1;
              }
              setValue(type, Math.round(value * 1000) / 1000, axis);
            }}
          >
            -
          </Button>
          <input
            ref={inputRef}
            autoFocus={autoFocus}
            type="number"
            className="ParameterInput"
            defaultValue={defaultValue}
            style={{
              width: "80px",
              fontSize: "18px", fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
              background: "transparent", color: "white",
              appearance: "none",
              textAlign: "center",
              border: "none",
              outline: "none"
            }}
            onFocus={(e) => {
              e.target.style.outline = 'none';
              e.target.style.border = '2px solid #41cbff';
              threeParamsEntry.current = `${type} ${axis}`;
            }}
            onBlur={() => {
              threeParamsEntry.current = null;
            }}
            onChange={(event) => {
              let prevValue = getValue(type, axis);
              if(!prevValue) prevValue = 0;

              // If the value has changed
              const newValue = Math.round(Number(event.target.value) * 1000) / 1000;
              if(prevValue !== newValue)
                setValue(type, Math.round(Number(event.target.value) * 1000) / 1000, axis);
            }}
          />
          <Button
            style={{
              height: "34px", minWidth: "34px", width: "34px", padding: 0,
              fontSize: "22px", fontWeight: "bold", color: "white"
            }}
            onClick={() => {
              let value = Number((inputRef.current as HTMLInputElement).value);
              if(type !== 'ROTATION'){
                value += 0.1;
              }
              else{
                value += 1;
              }
              setValue(type, Math.round(value * 1000) / 1000, axis);
            }}
          >
            +
          </Button>
        </div>
      );
    }

    const ParameterEntry = (type: "POSITION" | "ROTATION" | "SCALE", defaultValue: number, axis?: string) => {
      const entryRef = useRef<HTMLDivElement>(null);
      const mouseDown = useRef<boolean>(false);
      const mouseX = useRef<number>();
      const lastValue = useRef<number>(defaultValue);
      const accumulatedMovement = useRef<number>(0);

      useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
          if (!mouseDown.current) return;
          
          if (event.buttons === 0) {
            mouseDown.current = false;
            document.body.classList.remove('slider-active');
            threeParamsSlider.current = null;
            return;
          }

          if(threeParamsSlider.current){
            const sliderValues = threeParamsSlider.current.split(' ');
            if(type === sliderValues[0] && ((type === 'SCALE') || (axis === sliderValues[1]))){
              const SENSITIVITY = 3;
              
              // Accumulate movement
              accumulatedMovement.current += (event.movementX) * SENSITIVITY;
              
              // Check if we have enough accumulated movement
              while(Math.abs(accumulatedMovement.current) >= 1){
                const increment = Math.sign(accumulatedMovement.current);
                
                // Calculate new value
                const newValue = lastValue.current + increment * (type === 'ROTATION' ? 1 : 0.1);
                
                // Update last value
                lastValue.current = Math.round(newValue * 1000) / 1000;
                
                // Call setValue
                setValue(type, lastValue.current, axis);
                
                // Reduce accumulated movement
                accumulatedMovement.current -= increment;
              }
            }
          }
        };

        const handleMouseDown = (event: MouseEvent) => {
          if (
            (event.target as HTMLElement).tagName === "INPUT" || 
            (event.target as HTMLElement).tagName === "BUTTON"
          ) return;
          
          mouseX.current = event.clientX;
          mouseDown.current = true;
          document.body.classList.add('slider-active');
          threeParamsSlider.current = type + ((type !== 'SCALE') ? ' ' + axis : '');
          
          // Reset accumulated movement
          accumulatedMovement.current = 0;
          
          // Initialize lastValue with current value
          const currentValue = getValue(type, axis);
          if (currentValue !== undefined && currentValue !== null) {
            lastValue.current = currentValue;
          }
        };

        const handleMouseUp = (event: MouseEvent) => {
          mouseDown.current = false;
          document.body.classList.remove('slider-active');
          threeParamsSlider.current = null;
          accumulatedMovement.current = 0;
        };

        const entry = entryRef.current as HTMLDivElement;
        entry.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("pointerup", handleMouseUp);
        document.addEventListener("mouseleave", handleMouseUp);
        
        // Check if the sliding is continued
        if(threeParamsSlider.current){
          const sliderValues = threeParamsSlider.current.split(' ');
          if(
            (type === 'SCALE' && type === sliderValues[0]) || 
            (type !== 'SCALE' && type === sliderValues[0] && axis === sliderValues[1])
          ){
            requestAnimationFrame(() => {
              const event = new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: true,
                clientX: mouseX.current,
                clientY: 100
              });
              entry.dispatchEvent(event);
            });
          }
        }

        return () => {
          entry.removeEventListener("mousedown", handleMouseDown);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          document.removeEventListener("pointerup", handleMouseUp);
          document.removeEventListener("mouseleave", handleMouseUp);
        };
      }, []);
      
      return (
        <Box
          ref={entryRef}
          sx={{
            display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "start",
            width: "80%",
            cursor: "col-resize"
          }}
          key={type+axis}
        >
          <Typography
            sx={{
              minWidth: "30px",
              fontSize: "20px", fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
              color: "white",
              textAlign: "left",
              marginRight: "20px",
            }}
          >
            {axis} :
          </Typography>
          <ParameterInput type={type} defaultValue={defaultValue} axis={axis}/>
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
          {placeHolderData && placeHolderData.map((placeHolderItem) => {
            const placeHolderEntity = Object.values(envProducts).find((envProduct: EnvProduct) => envProduct.placeHolderId === placeHolderItem.id);

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
                    {products.find((product) => product.id === placeHolderEntity?.id)?.title || envAssets[placeHolderEntity?.id || '']?.name || ". . . . . ."}
                  </Typography>
                  <Button
                    sx={{
                      minWidth: "30%", height: "40px",
                      padding: "10px", boxSizing: "border-box",
                      fontFamily: "'Poppins', sans-serif", fontSize: "14px",
                      color: "white", borderRadius: 0,
                      background: "linear-gradient(135deg, #8458FB, #6A6CEC, #4D82DC, #3098CB, #17ABBD)",
                      "&:hover": {
                        backgroundColor: "rgb(109, 192, 255)",
                      }
                    }}
                    disabled={placeHolderEntity !== undefined}
                    onClick={() => {
                      if(entityType === "PRODUCT" && envProduct){
                        const newEnvProduct: EnvProduct = {
                          id: envProduct.id,
                          isEnvironmentProduct: true,
                          placeHolderId: placeHolderItem.id
                        }
                        modifyEnvProduct(envProduct?.id, newEnvProduct);
                      }
                    }}
                    className="UsePlaceHolderButton"
                  >
                    {placeHolderEntity === undefined ? "Use" : "In Use"}
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
                  onChange={(event) => {handleCheckboxChange(event, {productId: product.id})}}
                  color={"primary"}
                  className="CheckboxToggle"
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
                  src="icons/Image.svg"
                  className="MediaAttachButton"
                  sx={{
                    width: "30px", height: "30px",
                    opacity: (product.id === activeProductId  && toolType === "MEDIA") ? 1 : ((envProducts[product.id]?.isEnvironmentProduct) ? 0.5 : 0.2),
                    "&:hover": {
                      opacity: (envProducts[product.id]?.isEnvironmentProduct) ? 1 : 0.2,
                      cursor: (envProducts[product.id]?.isEnvironmentProduct) ? "pointer" : "arrow"
                    }
                  }}
                  onClick={() => {
                    if(envProducts[product.id]?.isEnvironmentProduct){
                      setMediaType(envProducts[product.id]?.type || 'PHOTO');
                      if(product.id === activeProductId){
                        if(toolType !== "MEDIA"){
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
                  className="CubeParamsButton"
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
                    if(envProducts[product.id] && envProducts[product.id].isEnvironmentProduct){
                      setParamsType(envProducts[product.id].placeHolderId !== undefined ? 'PLACEHOLDER' : 'CUSTOM');
                      if(product.id === activeProductId){
                        if(toolType !== "3DPARAMS"){
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
                fontFamily: "'Poppins', sans-serif", fontSize: "16px", 
                textTransform: "none",
                color: mediaType === "PHOTO" ? "white" : "rgb(77, 177, 255)",
                background: mediaType === "PHOTO" ? "linear-gradient(135deg, #8458FB, #6A6CEC, #4D82DC, #3098CB, #17ABBD)" : "transparent",
                borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: mediaType === "PHOTO" ? "none" : "solid", borderRadius: "0",
                "&:hover": {
                  backgroundColor: mediaType === "PHOTO" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
                  color: "white"
                }
              }}
              onClick={() => {
                if(mediaType !== "PHOTO") setMediaType("PHOTO");
              }}
              className="2DButton"
            >
              2D
            </Button>
            <Button
              sx={{
                width: "40%", height: "100%", flexGrow: 1,
                padding: "10px", boxSizing: "border-box",
                fontFamily: "'Poppins', sans-serif", fontSize: "16px", 
                textTransform: "none",
                color: mediaType === "MODEL_3D" ? "white" : "rgb(77, 177, 255)",
                background: mediaType === "MODEL_3D" ? "linear-gradient(135deg, #8458FB, #6A6CEC, #4D82DC, #3098CB, #17ABBD)" : "transparent",
                borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: mediaType === "MODEL_3D" ? "none" : "solid", borderRadius: "0",
                "&:hover": {
                  backgroundColor: mediaType === "MODEL_3D" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
                  color: "white"
                }
              }}
              onClick={() => {
                if(mediaType !== "MODEL_3D") setMediaType("MODEL_3D");
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

        // Ensure there are not more than 5 model products
        if(type === "MODEL_3D"){
          if(Object.values(envProducts).filter((envProduct) => (envProduct.type === "MODEL_3D" && envProduct.isEnvironmentProduct)).length >= 5){
            showPremiumPopup("Your current plan supports only up to 5 product models. Reach out to our sales team to unlock more exclusive options.");
            return;
          }
        }

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
              {mediaType === "PHOTO" &&
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
              {mediaType === "MODEL_3D" &&
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
            onChange={(event) => {handleCheckboxChange(event, {productId: product.id})}}
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
            src="icons/Image.svg"
            sx={{
              width: "30px", height: "30px",
              opacity: (product.id === activeProductId && toolType === "MEDIA") ? 1 : ((envProduct?.isEnvironmentProduct) ? 0.5 : 0.2),
              "&:hover": {
                opacity: (envProduct?.isEnvironmentProduct) ? 1 : 0.2,
                cursor: (envProduct?.isEnvironmentProduct) ? "pointer" : "arrow"
              }
            }}
            onClick={() => {
              setMediaType(envProducts[product.id]?.type || 'PHOTO');
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
                setParamsType(envProducts[product.id].placeHolderId !== undefined ? 'PLACEHOLDER' : 'CUSTOM');
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
  
  const AssetSourceButtons = () => {
    return (
      <Box
        sx={{
          display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
          width: "100%", height: "100px", gap: "25px",
          padding: "30px", boxSizing: "border-box"
        }}
        className="AssetSourceButtons"
      >
        <Button
          sx={{
            width: "40%", height: "100%", flexGrow: 1,
            padding: "10px", boxSizing: "border-box",
            fontFamily: "'Poppins', sans-serif", fontSize: "16px", 
            textTransform: "none",
            color: assetSource === "LIBRARY" ? "white" : "rgb(77, 177, 255)",
            background: assetSource === "LIBRARY" ? "linear-gradient(135deg, #8458FB, #6A6CEC, #4D82DC, #3098CB, #17ABBD)" : "transparent",
            borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: assetSource === "LIBRARY" ? "none" : "solid", borderRadius: "0",
            "&:hover": {
              backgroundColor: assetSource === "LIBRARY" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
              color: "white"
            }
          }}
          onClick={() => {
            if(assetSource !== "LIBRARY") {
              setAssetSource("LIBRARY");
              setActiveAssetId(null);
            }
          }}
          className="LibraryButton"
        >
          Library
        </Button>
        <Button
          sx={{
            width: "40%", height: "100%", flexGrow: 1,
            padding: "10px", boxSizing: "border-box",
            fontFamily: "'Poppins', sans-serif", fontSize: "16px", 
            textTransform: "none",
            color: assetSource === "OWN" ? "white" : "rgb(77, 177, 255)",
            background: assetSource === "OWN" ? "linear-gradient(135deg, #8458FB, #6A6CEC, #4D82DC, #3098CB, #17ABBD)" : "transparent",
            borderWidth: "2px", borderColor: "rgb(77, 177, 255)", borderStyle: assetSource === "OWN" ? "none" : "solid", borderRadius: "0",
            "&:hover": {
              backgroundColor: assetSource === "OWN" ? "rgb(77, 177, 255)" : "rgba(77, 178, 255, 0.3)", 
              color: "white"
            }
          }}
          onClick={() => {
            if(assetSource !== "OWN") {
              setAssetSource("OWN");
              setActiveAssetId(null);
            }
          }}
          className="OwnButton"
        >
          Your Assets
        </Button>
      </Box>
    );
  };

  const FileSelector = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
  
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
  
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
  
      const droppedFiles = Array.from(event.dataTransfer.files || []);
      const validFiles = droppedFiles.filter((file: File) => ALLOWED_MIME_TYPES.includes(file.type) || file.name.endsWith('.glb'));
      
      if(validFiles.length !== droppedFiles.length){
        console.error('Invalid Files Present');
        return;
      }
      if(!brandData) return;
      await AssetService.uploadAssetFiles(brandData.brand_name, validFiles, Object.values(envAssets).filter((envAsset) => envAsset.isEnvironmentAsset && envAsset.source === 'OWN').length).then((result) => {
        if(!result || result.assets) return;
        Object.keys(result.assets).forEach((id) => {
          modifyEnvAsset(id, result.assets[id]);
        });

        // Check for any errors
        if(result.fileErrors && result.fileErrors.length > 0){
          if(result.fileErrors.map((fileError) => fileError.code).includes(ERROR_CODES.FILE_TOO_LARGE)) {
            showPremiumPopup('Your current plan only supports assets of maximum size 2MB. Reach out to our sales team for more exclusive options.');
          }
        }
      });
    };
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      const validFiles = selectedFiles.filter((file: File) => ALLOWED_MIME_TYPES.includes(file.type) || file.name.endsWith('.glb'));
      
      if (validFiles.length !== selectedFiles.length) {
        console.error('Invalid Files Present');
        return;
      }
      
      if(!brandData) return;
      await AssetService.uploadAssetFiles(brandData.brand_name, validFiles, Object.values(envAssets).filter((envAsset) => envAsset.isEnvironmentAsset && envAsset.source === 'OWN').length).then((result) => {
        if(!result || !result.assets) return;
        Object.keys(result.assets).forEach((id) => {
          modifyEnvAsset(id, result.assets[id]);
        });

        // Check for any errors
        if(result.fileErrors && result.fileErrors.length > 0){
          if(result.fileErrors.map((fileError) => fileError.code).includes(ERROR_CODES.FILE_TOO_LARGE)) {
            showPremiumPopup('Your current plan only supports assets of maximum size 2MB. Reach out to our sales team for more exclusive options.');
          }
        }
      });
      
      // Clear the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <Box
        sx={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          width: "calc(100% - 60px)", margin: '30px',
          minHeight: "220px",
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
          accept={ALLOWED_MIME_TYPES.join(',')+',.glb'}
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

  // Asset List
  const assetListRef = useRef<HTMLDivElement>(null);
  const assetItemRefs = useRef<{[id: string]: HTMLSpanElement | null}>({});

  // Scroll save
  const assetListScroll = useRef<number>(0);
  useEffect(() => {
    const handleScroll = () => {
      if(assetListRef.current){
        assetListScroll.current = assetListRef.current.scrollTop;
      }
    };

    const currentRef = assetListRef.current;
    currentRef?.addEventListener("scroll", handleScroll);

    return () => {
      currentRef?.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Scroll load
  useEffect(() => {
    if(!activeAssetId && assetListRef.current){
      assetListRef.current.scrollTop = assetListScroll.current;
    }
  }, [activeAssetId]);

  // Delete asset function
  const deleteAsset = async(id: string) => {
    if(!brandData) return;
    const result = await AssetService.deleteAssetFile(brandData.brand_name, id);
    
    console.log(result);
    if(result.status === 200 && result.id){
      const newEnvAssets = envAssets;
      delete newEnvAssets[result.id];
      if(activeAssetId === result.id){
        setActiveAssetId(null);
      }
      setEnvAssets(newEnvAssets);
    }
  };

  const AssetList = () => {
    return ( !activeAssetId &&
      <Box
        sx={{
          width: "100%", flexGrow: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
          overflowY: "scroll", scrollbarWidth: 0, "&::-webkit-scrollbar": { display: "none" },
        }}
        ref={assetListRef}
        className="AssetList"
      >
        {Object.values(envAssets).filter((envAsset) => envAsset.source === assetSource).map((envAsset: EnvAsset) => {
          const assetId = envAsset.id;
          
          return (
            <span 
              key={assetId}
              ref={el => assetItemRefs.current[assetId] = el}
              style={{
                width: "100%"
            }}>
              <Box
                sx={{
                  width: "100%", gap: "5%", minHeight: "80px", height: "80px",
                  display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center",
                  backgroundColor: (envAssets[assetId]?.isEnvironmentAsset) ? "rgb(10, 10, 10)" : "rgb(5, 5, 5)",
                  padding: "0 15px 0 15px", boxSizing: "border-box"
                }}
                key={assetId}
                className="AssetItem"
              >
                <Checkbox
                  sx={{
                    background: "transparent",
                    color: "rgb(56, 56, 56)",
                    padding: 0,
                    borderRadius: 0,
                  }}
                  checked={envAssets[assetId]?.isEnvironmentAsset || false}
                  onChange={(event) => {handleCheckboxChange(event, {assetId: assetId})}}
                  color={"primary"}
                />
                <Box
                  component="img"
                  src={envAsset.type === 'PHOTO'? envAsset.src : 'icons/Cube.svg'}
                  sx={{
                    height: "60px",
                    width: "60px",
                    minWidth: "60px",
                    backgroundColor: envAsset.type === 'PHOTO'? "rgba(255, 255, 255, 0.3)" : "transparent",
                    objectFit: "contain",
                    opacity: (envAsset.isEnvironmentAsset) ? 1 : 0.5
                  }}
                />
                <Typography
                  sx={{
                    flexGrow: 1,
                    fontSize: { xs: "16px", },
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "normal",
                    color: (envAsset?.isEnvironmentAsset) ? "rgba(255, 255, 255, 0.83)" : "rgba(255, 255, 255, 0.25)",
                    textAlign: "left",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    "&:hover": {
                      cursor: envAsset.isEnvironmentAsset? "pointer" : "default",
                      textDecoration: envAsset.isEnvironmentAsset? "underline": "none"
                    }
                  }}
                  onClick={() => {if(envAsset.isEnvironmentAsset) setActiveAssetId(envAsset.id)}}
                >
                  {envAsset.name}
                </Typography>
                {envAsset.source === 'OWN' && <Box
                  component="img"
                  src="icons/Dustbin.svg"
                  sx={{
                    width: "30px", height: "30px",
                    opacity: (envAsset?.isEnvironmentAsset) ? 0.7 : 0.4,
                    "&:hover": {
                      cursor: "pointer",
                      opacity: (envAsset?.isEnvironmentAsset) ? 1 : 0.4
                    }
                  }}
                  onClick={() => deleteAsset(envAsset.id)}
                />}
              </Box>
            </span>
          );
        })}
      </Box>
    );
  }

  const AssetEditor = () => {
    const assetEditorRef = useRef<HTMLDivElement>(null);
    const assetItemRef = useRef<HTMLDivElement>(null);
    const envAsset = activeAssetId? envAssets[activeAssetId] : null;

    const AssetPane = () => {
      // Auto compute Asset pane height
      const [assetPaneHeight, setAssetPaneHeight] = useState<number>(0);
      useEffect(() => {
        setAssetPaneHeight((assetEditorRef.current?.clientHeight || 0) - (assetItemRef.current?.clientHeight || 0));
      }, []);
      if(!activeAssetId) return null;
      
      return (
        <Box
          sx={{
            display: "flex", flexDirection: "column", alignItems: "center",
            width: "100%", height: `${assetPaneHeight}px`,
            backgroundColor: "black",
          }}
          className="AssetPane"
        >
          <ThreeParamsEditor/>
        </Box>
      );
    };

    return ( envAsset &&
      <Box
        sx={{
          width: "100%", flexGrow: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
          overflowY: "scroll", scrollbarWidth: 0, "&::-webkit-scrollbar": { display: "none" },
        }}
        ref={assetEditorRef}
        className="AssetEditor"
      >
        <Box
          sx={{
            width: "100%", gap: "5%", minHeight: "80px", height: "80px",
            display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center",
            backgroundColor: (envAsset?.isEnvironmentAsset) ? "rgb(10, 10, 10)" : "rgb(5, 5, 5)",
            padding: "0 15px 0 15px", boxSizing: "border-box"
          }}
          className="AssetItem"
        >
          <Checkbox
            sx={{
              background: "transparent",
              color: "rgb(56, 56, 56)",
              padding: 0,
              borderRadius: 0,
            }}
            checked={envAsset.isEnvironmentAsset || false}
            onChange={(event) => {handleCheckboxChange(event, {assetId: envAsset.id})}}
            color={"primary"}
          />
          <Box
            component="img"
            src={(envAsset.type === "PHOTO") ? envAsset.src : 'icons/Cube.svg'}
            sx={{
              height: "60px",
              width: "60px",
              minWidth: "60px",
              backgroundColor: (envAsset.type === "PHOTO") ? "rgba(255, 255, 255, 0.2)" : "transparent",
              objectFit: "contain",
              opacity: (envAsset?.isEnvironmentAsset) ? 1 : 0.5
            }}
          />
          <Typography
            sx={{
              flexGrow: 1,
              fontSize: { xs: "16px", },
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "normal",
              color: (envAsset?.isEnvironmentAsset) ? "rgba(255, 255, 255, 0.83)" : "rgba(255, 255, 255, 0.25)",
              textAlign: "left",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {envAsset.name}
          </Typography>
          {envAsset.source === 'OWN' && <Box
            component="img"
            src="icons/Dustbin.svg"
            sx={{
              width: "30px", height: "30px",
              opacity: (envAsset?.isEnvironmentAsset) ? 0.7 : 0.4,
              "&:hover": {
                cursor: (envAsset?.isEnvironmentAsset) ? "pointer" : "default",
                opacity: (envAsset?.isEnvironmentAsset) ? 1 : 0.4
              }
            }}
            onClick={() => deleteAsset(envAsset.id)}
          />}
        </Box>
        <AssetPane/>
      </Box>
    );
  };

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
      {entityType === "ASSET" && <AssetSourceButtons/>}
      {entityType === "ASSET" && assetSource === "OWN" && !activeAssetId && <FileSelector/>}
      {entityType === "ASSET" && <AssetList/>}
      {entityType === "ASSET" && <AssetEditor/>}
      {!activeProductId && !activeAssetId && <FullWideButton text={"Save Store"} onClick={
        async () => {
          if(!brandData) return;
          Swal.fire({
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
          }).then(async (response) => {
            if(response.isConfirmed){
              try{
                const envResponse = await EnvStoreService.storeEnvData(
                  brandData.brand_name,
                  Object.values(envProducts).filter((envProduct) => envProduct.isEnvironmentProduct),
                  Object.values(envAssets).filter((envAsset) => envAsset.isEnvironmentAsset)
                );
                console.log(envResponse);
                
                Swal.fire({
                  title: "XR Store Updated",
                  text: "Your store has been updated successfully!",
                  html: `<a href="https://${brandData.brand_name}.strategyfox.in" target="_blank">Go to your XR Store</a>`,
                  icon: "success",
                  allowOutsideClick: false,
                  customClass: {
                    title: styles.swalTitle,
                    popup: styles.swalPopup,
                    htmlContainer: styles.swalPopup
                  },
                });
              }
              catch(error){
                console.error(error);
              } 
            }
          });
        }
      }
      />}
      {entityType === "PRODUCT" && activeProductId && 
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
      {entityType === "ASSET" && activeAssetId && 
        <FullWideButton text={"Done"} 
          onClick={() => {
            setActiveAssetId(null);
          }}
        />
      }
    </Box>
  );
};