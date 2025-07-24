import React, { useCallback, useMemo, useRef, useState, memo, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Typography,
  Slider,
  styled,
  Chip,
  Collapse,
  Tabs,
  Tab,
  TextField,
  ImageList,
  ImageListItem,
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
  background: "rgba(30, 30, 30, 0.95)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease",
  padding: "20px",
  "&:hover": {
    background: "rgba(35, 35, 35, 0.98)",
    borderColor: "rgba(255, 127, 50, 0.3)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 32px rgba(255, 127, 50, 0.15)",
  },
}));

const GlassButton = styled(Button)<{ isPrimary?: boolean }>(
  ({ isPrimary }) => ({
    borderRadius: "12px",
    textTransform: "none",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    padding: "12px 24px",
    minHeight: "48px",
    transition: "all 0.3s ease",
    backdropFilter: "blur(12px)",
    border: isPrimary
      ? "2px solid #FF7F32"
      : "2px solid rgba(255, 255, 255, 0.2)",
    ...(isPrimary
      ? {
          background: "#FF7F32",
          color: "white",
          "&:hover": {
            background: "#E6722D",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(255, 127, 50, 0.3)",
          },
        }
      : {
          background: "rgba(255, 255, 255, 0.02)",
          color: "rgba(255, 255, 255, 0.7)",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.05)",
            borderColor: "rgba(255, 127, 50, 0.4)",
            color: "white",
            transform: "translateY(-1px)",
          },
        }),
  })
);

const GlassSlider = styled(Slider)(() => ({
  color: "#FF7F32",
  height: 6,
  padding: "15px 0",
  "& .MuiSlider-track": {
    background: "#FF7F32",
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    border: "2px solid #FF7F32",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      boxShadow: "0 8px 20px rgba(255, 127, 50, 0.6)",
      borderColor: "#FF7F32",
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
    "&.Mui-active": {
      boxShadow: "0 10px 24px rgba(255, 127, 50, 0.8)",
      borderColor: "#FF7F32",
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
  },
  "& .MuiSlider-rail": {
    color: "rgba(255, 255, 255, 0.1)",
    opacity: 1,
  },
}));

const AnimatedChip = styled(Chip)(() => ({
  background: "rgba(30, 30, 30, 0.8)",
  color: "white",
  border: "1px solid rgba(255, 127, 50, 0.4)",
  borderRadius: "20px",
  fontFamily: "'DM Sans', sans-serif",
  transition: "all 0.3s ease",
  height: "24px",
  fontSize: "0.8125rem",
  minWidth: "55px",
  fontWeight: 500,
  "& .MuiChip-labelSmall": {
    paddingLeft: "8px",
    paddingRight: "8px",
    lineHeight: "24px",
    display: "flex",
    justifyContent: "center",
  },
  "&:hover": {
    background: "rgba(255, 127, 50, 0.25)",
    borderColor: "rgba(255, 127, 50, 0.6)",
    transform: "scale(1.05)",
  },
}));

// Orange-theme tab used in EntityTypeSelector
const OrangeTab = styled(Tab)(() => ({
  textTransform: "none",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600,
  minHeight: 42,
  flex: 1,
  borderRadius: 0,
  padding: "10px 0",
  color: "#FF7F32",
  background: "rgba(255, 255, 255, 0.06)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  transition: "all 0.25s ease",
  '&:hover': {
    background: "rgba(255, 255, 255, 0.1)",
  },
  '&.Mui-selected': {
    color: "#FFFFFF",
    backgroundColor: "#FF7F32",
    border: "1px solid #FF7F32",
    boxShadow: "0 4px 12px rgba(255, 127, 50, 0.3)",
  },
  '&:first-of-type': {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  '&:last-of-type': {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
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
    const handleChange = (_evt: React.SyntheticEvent, value: string) => {
      if (value) onEntityTypeChange(value as "PRODUCT" | "ASSET");
    };

    return (
      <Tabs
        value={entityType}
        onChange={handleChange}
        variant="fullWidth"
        sx={{
          mb: 2,
          minHeight: 42,
          '& .MuiTabs-flexContainer': { gap: 0 },
          '& .MuiTabs-indicator': { display: 'none' },
        }}
      >
        <OrangeTab iconPosition="start" icon={<Layers size={16} />} label="Products" value="PRODUCT" disableRipple />
        <OrangeTab iconPosition="start" icon={<BoxIcon size={16} />} label="Assets" value="ASSET" disableRipple />
      </Tabs>
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

// -----------------------------------------------------------------------------
// CompactTabPanel – single glass box that behaves like an accordion but keeps
// the underlying "tab" state logic intact. It renders the header (two buttons)
// and collapses/expands its children inline, reducing vertical whitespace.
// -----------------------------------------------------------------------------

const CompactTabPanel = memo(
  ({
    activeTab,
    onTabChange,
    mediaContent,
    positionContent,
  }: {
    activeTab: "MEDIA" | "POSITION";
    onTabChange: (tab: "MEDIA" | "POSITION") => void;
    mediaContent?: React.ReactNode;
    positionContent?: React.ReactNode;
  }) => {
    return (
      <GlassBox sx={{ mb: 2, p: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <GlassButton
            isPrimary={activeTab === "MEDIA"}
            onClick={() => onTabChange("MEDIA")}
            startIcon={<ImageIcon size={18} />}
            fullWidth
          >
            Media
          </GlassButton>
          <GlassButton
            isPrimary={activeTab === "POSITION"}
            onClick={() => onTabChange("POSITION")}
            startIcon={<Settings size={18} />}
            fullWidth
          >
            Position
          </GlassButton>
        </Box>

        {/* Media Collapse */}
        <Collapse in={activeTab === "MEDIA"} timeout="auto" unmountOnExit sx={{ mt: 2 }}>
          {mediaContent}
        </Collapse>

        {/* Position Collapse */}
        <Collapse in={activeTab === "POSITION"} timeout="auto" unmountOnExit sx={{ mt: 2 }}>
          {positionContent}
        </Collapse>
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

// Orange icon style constant
const ORANGE_ICON_PROPS = {
  color: "#FF7F32",
  style: { filter: "drop-shadow(0 0 4px rgba(255,127,50,0.6))" },
};

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

    const [inputValue, setInputValue] = React.useState<string>(value.toString());

    // Sync local input when external value changes (slider dragged elsewhere)
    React.useEffect(() => {
      setInputValue(value.toString());
    }, [value]);

    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        setInputValue(val);

        // Only commit to parent when val is a valid number
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
          onChange(parsed);
        }
      },
      [onChange]
    );

    const handleInputBlur = useCallback(() => {
      // If the field is cleared, reset to current value
      if (inputValue.trim() === '' || isNaN(parseFloat(inputValue))) {
        setInputValue(value.toString());
      }
    }, [inputValue, value]);

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
              {Icon && <Icon size={16} {...ORANGE_ICON_PROPS} />}
            </Box>
            <Typography
              sx={{
              fontFamily: "'DM Sans', sans-serif",
                color: "white",
                fontSize: "14px",
              fontWeight: 600,
                lineHeight: "24px",
              }}
            >
              {label}
            </Typography>
          </Box>
          {/* Group 2: Numeric input */}
          <TextField
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            variant="outlined"
            size="small"
            type="number"
            sx={{
              width: "70px",
              input: {
                p: "6px 8px",
                color: "white",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                textAlign: "center",
              },
              fieldset: {
                borderColor: "rgba(255, 255, 255, 0.25)",
              },
              '& .MuiOutlinedInput-root:hover fieldset': {
                borderColor: "#FF7F32",
              },
              '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                borderColor: "#FF7F32",
              },
            }}
          />
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
              <Icon size={18} {...ORANGE_ICON_PROPS} />
            </Box>
          )}
          <Typography
            sx={{
            fontFamily: "'DM Sans', sans-serif",
              color: "white",
              fontSize: "16px",
            fontWeight: 700,
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
          fontFamily: "'DM Sans', sans-serif",
            color: "white",
            fontSize: "16px",
          fontWeight: 700,
            mb: 1.5,
          }}
        >
          Player Face Direction
        </Typography>
        <Typography
          sx={{
            fontFamily: "'DM Sans', sans-serif",
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
              onClick={() => onChange(opt.value)}
              sx={{
                flex: 1,
                minWidth: "0px",
                px: 0,
                color: value === opt.value ? "#FFFFFF" : "rgba(255,255,255,0.85)",
                background: value === opt.value ? "#FF7F32" : "rgba(255,255,255,0.06)",
                backdropFilter: "blur(6px)",
                border: value === opt.value
                  ? "1px solid #FF7F32"
                  : "1px solid rgba(255,255,255,0.2)",
                borderRadius: 2,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                transition: "all 0.25s ease",
                '&:hover': {
                  background: value === opt.value ? "#FF7F32" : "rgba(255,255,255,0.12)",
                  borderColor: "#FF7F32",
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
              ? "2px dashed rgba(255, 127, 50, 0.8)"
              : "2px dashed rgba(255, 127, 50, 0.4)",
            borderRadius: "12px",
            background: isDragOver ? "rgba(255, 127, 50, 0.1)" : "transparent",
            transition: "all 0.3s ease",
            cursor: "pointer",
            "&:hover": {
              borderColor: "rgba(255, 127, 50, 0.6)",
              background: "rgba(255, 127, 50, 0.05)",
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
          <Upload size={48} color="rgba(255, 127, 50, 0.8)" />
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              color: "rgba(255, 127, 50, 0.9)",
              fontSize: "16px",
              fontWeight: 700,
              mt: 2,
            }}
          >
            Upload Files
          </Typography>
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
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
    onSetActiveTab,
  }: {
    assets: EnvAsset[];
    onCheckboxChange: (
      event: React.ChangeEvent<HTMLInputElement>,
      params: { assetId: string }
    ) => void;
    onDelete: (assetId: string) => void;
    onEdit: (assetId: string) => void;
    onSetActiveTab: (tab: "MEDIA" | "POSITION") => void;
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
                  ? "rgba(255, 127, 50, 0.08)"
                  : "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255, 127, 50, 0.12)",
                  borderColor: "#FF7F32",
                },
              }}
            >
              <Checkbox
                checked={asset.isEnvironmentAsset || false}
                onChange={(event) =>
                  onCheckboxChange(event, { assetId: asset.id })
                }
                sx={{
                  color: "rgba(255, 127, 50, 0.8)",
                  "&.Mui-checked": {
                    color: "#FF7F32",
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
                  fontFamily: "'DM Sans', sans-serif",
                  color: asset.isEnvironmentAsset
                    ? "white"
                    : "rgba(255, 255, 255, 0.5)",
                  fontSize: "14px",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {asset.name}
              </Typography>
              {asset.isEnvironmentAsset && (
                <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                    onClick={() => {
                      onEdit(asset.id);
                      onSetActiveTab("MEDIA");
                    }}
                  sx={{
                      minWidth: "36px",
                      width: "36px",
                      height: "36px",
                      padding: 0,
                      color: "rgba(255, 127, 50, 0.8)",
                      border: "1px solid rgba(255, 127, 50, 0.3)",
                      borderRadius: "8px",
                      "&:hover": { 
                        color: "white",
                        backgroundColor: "rgba(255, 127, 50, 0.1)",
                        borderColor: "rgba(255, 127, 50, 0.6)",
                      },
                  }}
                >
                    <ImageIcon size={16} />
                </Button>
                  <Button
                    size="small"
                                         onClick={() => {
                       onEdit(asset.id);
                       onSetActiveTab("POSITION");
                     }}
                    sx={{
                      minWidth: "36px",
                      width: "36px",
                      height: "36px",
                      padding: 0,
                      color: "rgba(255, 127, 50, 0.8)",
                      border: "1px solid rgba(255, 127, 50, 0.3)",
                      borderRadius: "8px",
                      "&:hover": { 
                        color: "white",
                        backgroundColor: "rgba(255, 127, 50, 0.1)",
                        borderColor: "rgba(255, 127, 50, 0.6)",
                      },
                    }}
                  >
                    <Settings size={16} />
                  </Button>
                </Box>
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
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "18px",
            fontWeight: 700,
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
          {mediaType === "PHOTO" && (
            <ImageList variant="standard" cols={2} gap={12} sx={{ width: '100%', m: 0 }}>
              {product.images.map((image, index) => (
                <ImageListItem
                  key={index}
                  onClick={() => onMediaSelect("PHOTO", index)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: envProduct.imageIndex === index ? '2px solid #FF7F32' : '1px solid rgba(255,255,255,0.1)',
                    transition: 'border-color 0.25s ease',
                    '&:hover': { borderColor: '#FF7F32' },
                  }}
                >
                  <img
                    src={image.src}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    alt={product.title}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}

          {mediaType === "MODEL_3D" &&
            product.models.map((model, index) => (
              <Box
                key={index}
                sx={{
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background:
                    envProduct.modelIndex === index
                      ? "rgba(255, 127, 50, 0.2)"
                      : "rgba(255, 255, 255, 0.05)",
                  border:
                    envProduct.modelIndex === index
                      ? "2px solid #FF7F32"
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
                    background: "#FF7F32",
                    color: "white",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    "&:hover": {
                      background: "#E6722D",
                    },
                  }}
                >
                  Use This Model
                </Button>
                <ModelViewer
                  style={{
                    width: "100%",
                    height: "220px",
                    backgroundColor: "rgb(15, 15, 15)",
                    borderRadius: "12px",
                  }}
                  data={{
                    id: model.id,
                    sources: [model.sources && model.sources[0]],
                    alt: model.id,
                  }}
                  ar={false}
                  cameraControls
                  environmentImage="neutral"
                  poster=""
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
                      ? "rgba(255, 127, 50, 0.2)"
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
                      : "#FF7F32",
                    color: "white",
                    minWidth: "80px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    "&:hover": {
                      background: "#E6722D",
                    },
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
    activeTab: assetActiveTab,
    setActiveTab: setAssetActiveTab,
  } = useEnvAssetStore();
  const { envProducts, modifyEnvProduct, activeProductId, setActiveProductId, activeTab, setActiveTab } =
    useEnvProductStore();

  const { brandData } = useBrandStore();

  const [entityType, setEntityType] = useState<"PRODUCT" | "ASSET">("PRODUCT");
  const [mediaType, setMediaType] = useState<"PHOTO" | "MODEL_3D">("PHOTO");
  const [paramsType, setParamsType] = useState<"CUSTOM" | "PLACEHOLDER">(
    "CUSTOM"
  );
  const [assetSource, setAssetSource] = useState<"LIBRARY" | "OWN">("LIBRARY");

  // Track previous state for products / assets to enable discard
  const [previousProductState, setPreviousProductState] = useState<EnvProduct | null>(null);
  const [previousAssetState, setPreviousAssetState] = useState<EnvAsset | null>(null);

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
        // Check for unsaved changes before switching
        const isProductDirty = activeProductId && previousProductState && JSON.stringify(envProducts[activeProductId]) !== JSON.stringify(previousProductState);
        const isAssetDirty = activeAssetId && previousAssetState && JSON.stringify(envAssets[activeAssetId]) !== JSON.stringify(previousAssetState);

        if (isProductDirty || isAssetDirty) {
          Swal.fire({
            title: "Unsaved Changes",
            text: "You have unsaved changes. What would you like to do?",
            icon: "warning",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save & Switch",
            denyButtonText: "Discard & Switch",
            cancelButtonText: "Stay",
            customClass: {
              title: styles.swalTitle,
              popup: styles.swalPopup,
              htmlContainer: styles.swalHtmlContainer,
              icon: styles.swalIcon,
              actions: styles.swalActions,
              confirmButton: `${styles.swalButton} ${styles.swalConfirmButton}`,
              denyButton: `${styles.swalButton} ${styles.swalDenyButton}`,
              cancelButton: `${styles.swalButton} ${styles.swalCancelButton}`,
            },
          }).then((result) => {
            if (result.isConfirmed) {
              // Save: just switch, changes are already in state
              setEntityType(type);
              setActiveProductId(null);
              setActiveAssetId(null);
            } else if (result.isDenied) {
              // Discard: revert changes then switch
              if (isProductDirty && previousProductState) {
                modifyEnvProduct(previousProductState.id, previousProductState);
              }
              if (isAssetDirty && previousAssetState) {
                modifyEnvAsset(previousAssetState.id, previousAssetState);
              }
              setEntityType(type);
              setActiveProductId(null);
              setActiveAssetId(null);
            }
            // if "Stay" (result.isDismissed), do nothing
          });
        } else {
          // No unsaved changes, switch directly
          setEntityType(type);
          setActiveProductId(null);
          setActiveAssetId(null);
          setActiveTab("MEDIA");
          setAssetActiveTab("MEDIA");
          if (type === "ASSET") {
            setParamsType("CUSTOM");
          }
        }
      }
    },
    [entityType, activeProductId, activeAssetId, previousProductState, previousAssetState, envProducts, envAssets, modifyEnvProduct, modifyEnvAsset, setActiveProductId, setActiveAssetId, setActiveTab, setAssetActiveTab]
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
          // Calculate current environment usage
          const currentEnvironmentSize = Object.values(envProducts)
            .filter(envProduct => envProduct.isEnvironmentProduct)
            .reduce((total, envProduct) => {
              const product = products.find(p => p.id === envProduct.id);
              if (!product) return total;
              
              // Calculate product file size
              if (envProduct.type === 'PHOTO') {
                const imageIndex = envProduct.imageIndex || 0;
                return total + (product.images[imageIndex]?.size || 0);
              } else if (envProduct.type === 'MODEL_3D') {
                const modelIndex = envProduct.modelIndex || 0;
                const model = product.models[modelIndex];
                if (model) {
                  if (model.sources && model.sources.length > 0) {
                    return total + (model.sources[0].filesize || 0);
                  }
                  return total + (model.filesize || 0);
                }
              }
              return total;
            }, 0);

          // Calculate asset environment usage
          const assetEnvironmentSize = Object.values(envAssets)
            .filter(envAsset => envAsset.isEnvironmentAsset)
            .reduce((total, envAsset) => total + (envAsset.filesize || 0), 0);

          const totalCurrentUsage = currentEnvironmentSize + assetEnvironmentSize;

          // Get environment threshold
          const environmentThreshold = environmentData[brandData?.environment_name?.toUpperCase() || '']?.maxThreshold || 30 * 1024 * 1024;

          // Calculate new product size
          let newProductSize = 0;
          const existingEnvProduct = envProducts[product.id];
          if (existingEnvProduct?.type === 'PHOTO') {
            const imageIndex = existingEnvProduct.imageIndex || 0;
            newProductSize = product.images[imageIndex]?.size || 0;
          } else if (existingEnvProduct?.type === 'MODEL_3D') {
            const modelIndex = existingEnvProduct.modelIndex || 0;
            const model = product.models[modelIndex];
            if (model) {
              if (model.sources && model.sources.length > 0) {
                newProductSize = model.sources[0].filesize || 0;
              } else {
                newProductSize = model.filesize || 0;
              }
            }
          } else {
            // Default to first image size for new products
            newProductSize = product.images[0]?.size || 0;
          }

          // Check if adding this product would exceed the threshold
          if (totalCurrentUsage + newProductSize > environmentThreshold) {
            const availableSpace = environmentThreshold - totalCurrentUsage;
            const availableMB = (availableSpace / (1024 * 1024)).toFixed(2);
            const productMB = (newProductSize / (1024 * 1024)).toFixed(2);
            
            showPremiumPopup(
              `Cannot add product "${product.title}" (${productMB} MB). Environment has only ${availableMB} MB available. Consider removing some items or using smaller products.`
            );
            return;
          }
        }

        const isProductFirstTime =
          !envProducts[product.id]?.imageIndex &&
          !envProducts[product.id]?.modelIndex;

        if (event.target.checked) {
          setActiveProductId(product.id);
          if (isProductFirstTime) {
            setMediaType("PHOTO");
          }
          // Preload models
          product.models.forEach((model) => {
            useGLTF.preload(model.sources?.[0].url || "");
          });
        } else {
          setActiveProductId(null);
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
          // Calculate current environment usage
          const currentEnvironmentSize = Object.values(envProducts)
            .filter(envProduct => envProduct.isEnvironmentProduct)
            .reduce((total, envProduct) => {
              const product = products.find(p => p.id === envProduct.id);
              if (!product) return total;
              
              if (envProduct.type === 'PHOTO') {
                const imageIndex = envProduct.imageIndex || 0;
                return total + (product.images[imageIndex]?.size || 0);
              } else if (envProduct.type === 'MODEL_3D') {
                const modelIndex = envProduct.modelIndex || 0;
                const model = product.models[modelIndex];
                if (model) {
                  if (model.sources && model.sources.length > 0) {
                    return total + (model.sources[0].filesize || 0);
                  }
                  return total + (model.filesize || 0);
                }
              }
              return total;
            }, 0);

          const assetEnvironmentSize = Object.values(envAssets)
            .filter(envAsset => envAsset.isEnvironmentAsset)
            .reduce((total, envAsset) => total + (envAsset.filesize || 0), 0);

          const totalCurrentUsage = currentEnvironmentSize + assetEnvironmentSize;

          // Get environment threshold
          const environmentThreshold = environmentData[brandData?.environment_name?.toUpperCase() || '']?.maxThreshold || 30 * 1024 * 1024;

          // Check if adding this asset would exceed the threshold
          const assetSize = envAsset.filesize || 0;
          if (totalCurrentUsage + assetSize > environmentThreshold) {
            const availableSpace = environmentThreshold - totalCurrentUsage;
            const availableMB = (availableSpace / (1024 * 1024)).toFixed(2);
            const assetMB = (assetSize / (1024 * 1024)).toFixed(2);
            
            showPremiumPopup(
              `Cannot add asset "${envAsset.name}" (${assetMB} MB). Environment has only ${availableMB} MB available. Consider removing some items or using smaller assets.`
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
      setMediaType,
      setActiveProductId,
      setActiveAssetId,
      brandData,
    ]
  );

  // Handle file upload for assets
  const handleFileUpload = useCallback(
    async (files: File[]) => {
      if (!brandData) return;

      Swal.fire({
        title: "Uploading Assets...",
        text: "Please wait while your files are being uploaded.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
          htmlContainer: styles.swalHtmlContainer,
        },
      });

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
              isEnvironmentAsset: uploadedAssetData.isEnvironmentAsset || false,
            };
            modifyEnvAsset(id, assetWithDefaults);
          });

          if (result.fileErrors && result.fileErrors.length > 0) {
            Swal.close(); // Close loader before showing another popup
            if (
              result.fileErrors
                .map((fileError) => fileError.code)
                .includes(ERROR_CODES.FILE_TOO_LARGE)
            ) {
              showPremiumPopup(
                "Your current plan only supports assets of maximum size 2MB. Reach out to our sales team for more exclusive options."
              );
            }
          } else {
            Swal.fire({
              title: "Upload Complete",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
              customClass: {
                title: styles.swalTitle,
                popup: styles.swalPopup,
                htmlContainer: styles.swalHtmlContainer,
                icon: styles.swalIcon,
              },
            });
          }
        } else {
           Swal.fire({
              title: "Upload Failed",
              text: "No assets were returned from the server.",
              icon: "error",
               customClass: {
                  title: styles.swalTitle,
                  popup: styles.swalPopup,
                  htmlContainer: styles.swalHtmlContainer,
                  icon: styles.swalIcon,
              },
           });
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        Swal.fire({
            title: "Upload Error",
            text: "An error occurred while uploading. Please try again.",
            icon: "error",
            customClass: {
                title: styles.swalTitle,
                popup: styles.swalPopup,
                htmlContainer: styles.swalHtmlContainer,
                icon: styles.swalIcon,
            },
        });
      }
    },
    [brandData, envAssets, modifyEnvAsset, styles]
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
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
          htmlContainer: styles.swalHtmlContainer,
          icon: styles.swalIcon,
          actions: styles.swalActions,
          confirmButton: `${styles.swalButton} ${styles.swalConfirmButton}`,
          denyButton: `${styles.swalButton} ${styles.swalDenyButton}`,
          cancelButton: `${styles.swalButton} ${styles.swalCancelButton}`,
        },
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Deleting Asset...",
        text: "Please wait.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
          htmlContainer: styles.swalHtmlContainer,
        },
      });

      const removedAsset = envAssets[assetId];
      const { [assetId]: _discard, ...restAssets } = envAssets;
      setEnvAssets(restAssets);

      if (activeAssetId === assetId) {
        setActiveAssetId(null);
      }

      try {
        const response = await AssetService.deleteAssetFile(brandData.brand_name, assetId);
        if (response.status !== 200) throw new Error("Failed to delete asset");

        Swal.fire({
          title: "Asset Deleted",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            title: styles.swalTitle,
            popup: styles.swalPopup,
            htmlContainer: styles.swalHtmlContainer,
            icon: styles.swalIcon,
          },
        });
      } catch (error) {
        if (removedAsset) {
          setEnvAssets({ ...envAssets, [assetId]: removedAsset });
        }
        console.error("Error deleting asset:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete the asset.",
          icon: "error",
          customClass: {
            title: styles.swalTitle,
            popup: styles.swalPopup,
            htmlContainer: styles.swalHtmlContainer,
            icon: styles.swalIcon,
          },
        });
      }
    },
    [brandData, envAssets, setEnvAssets, activeAssetId, setActiveAssetId, styles]
  );

  // Handle media selection for products
  const handleMediaSelect = useCallback(
    (type: "MODEL_3D" | "PHOTO", index: number) => {
      if (!activeProductId) return;

      const product = products.find(
        (product) => product.id === activeProductId
      );
      if (!product) return;

      // Calculate current environment usage (excluding current product)
      const currentEnvironmentSize = Object.values(envProducts)
        .filter(envProduct => envProduct.isEnvironmentProduct && envProduct.id !== activeProductId)
        .reduce((total, envProduct) => {
          const product = products.find(p => p.id === envProduct.id);
          if (!product) return total;
          
          if (envProduct.type === 'PHOTO') {
            const imageIndex = envProduct.imageIndex || 0;
            return total + (product.images[imageIndex]?.size || 0);
          } else if (envProduct.type === 'MODEL_3D') {
            const modelIndex = envProduct.modelIndex || 0;
            const model = product.models[modelIndex];
            if (model) {
              if (model.sources && model.sources.length > 0) {
                return total + (model.sources[0].filesize || 0);
              }
              return total + (model.filesize || 0);
            }
          }
          return total;
        }, 0);

      const assetEnvironmentSize = Object.values(envAssets)
        .filter(envAsset => envAsset.isEnvironmentAsset)
        .reduce((total, envAsset) => total + (envAsset.filesize || 0), 0);

      const totalCurrentUsage = currentEnvironmentSize + assetEnvironmentSize;

      // Get environment threshold
      const environmentThreshold = environmentData[brandData?.environment_name?.toUpperCase() || '']?.maxThreshold || 30 * 1024 * 1024;

      // Calculate new product size based on selected type and index
      let newProductSize = 0;
      if (type === 'PHOTO') {
        newProductSize = product.images[index]?.size || 0;
      } else if (type === 'MODEL_3D') {
        const model = product.models[index];
        if (model) {
          if (model.sources && model.sources.length > 0) {
            newProductSize = model.sources[0].filesize || 0;
          } else {
            newProductSize = model.filesize || 0;
          }
        }
      }

      // Check if changing to this media type would exceed the threshold
      if (totalCurrentUsage + newProductSize > environmentThreshold) {
        const availableSpace = environmentThreshold - totalCurrentUsage;
        const availableMB = (availableSpace / (1024 * 1024)).toFixed(2);
        const productMB = (newProductSize / (1024 * 1024)).toFixed(2);
        
        showPremiumPopup(
          `Cannot switch to ${type === 'MODEL_3D' ? '3D model' : 'image'} (${productMB} MB). Environment has only ${availableMB} MB available. Consider removing some items or using smaller media.`
        );
        return;
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
    [activeProductId, products, envProducts, envAssets, modifyEnvProduct, brandData]
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
        htmlContainer: styles.swalHtmlContainer,
        icon: styles.swalIcon,
        actions: styles.swalActions,
        confirmButton: `${styles.swalButton} ${styles.swalConfirmButton}`,
        denyButton: `${styles.swalButton} ${styles.swalDenyButton}`,
        cancelButton: `${styles.swalButton} ${styles.swalCancelButton}`,
      },
    });

    if (!result.isConfirmed) return;

    try {
      const envResponse = await EnvStoreService.storeEnvData(
        brandData.brand_name,
        Object.values(envProducts).filter((p) => p.isEnvironmentProduct),
        Object.values(envAssets).filter((a) => a.isEnvironmentAsset)
      );

      if (!envResponse) throw new Error("Failed to update store");

      Swal.fire({
        title: "XR Store Updated",
        text: "Your store has been updated successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Go to your XR Store",
        cancelButtonText: "Stay here",
        allowOutsideClick: false,
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
          htmlContainer: styles.swalHtmlContainer,
          icon: styles.swalIcon,
          actions: styles.swalActions,
          confirmButton: `${styles.swalButton} ${styles.swalConfirmButton}`,
          cancelButton: `${styles.swalButton} ${styles.swalCancelButton}`,
        },
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(`https://${brandData.brand_name}.shackit.in`, "_blank", "noopener,noreferrer");
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Failed to update the store. Please try again.",
        icon: "error",
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
          htmlContainer: styles.swalHtmlContainer,
          icon: styles.swalIcon,
        },
      });
    }
  }, [brandData, envProducts, envAssets]);

  // Capture snapshot when a product starts being edited
  useEffect(() => {
    if (activeProductId && !previousProductState) {
      const snapshot = envProducts[activeProductId];
      if (snapshot) {
        // shallow copy is enough as nested arrays are primitives
        setPreviousProductState({ ...snapshot });
      }
    }
    // Reset snapshot when editing ends
    if (!activeProductId) {
      setPreviousProductState(null);
    }
  }, [activeProductId, envProducts, previousProductState]);

  // Capture snapshot for asset editing
  useEffect(() => {
    if (activeAssetId && !previousAssetState) {
      const snap = envAssets[activeAssetId];
      if (snap) setPreviousAssetState({ ...snap });
    }
    if (!activeAssetId) {
      setPreviousAssetState(null);
    }
  }, [activeAssetId, envAssets, previousAssetState]);

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
          "rgba(25, 25, 25, 0.98)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        pointerEvents: "auto",
        overflow: "hidden",
      }}
      onClick={(event) => event.stopPropagation()}
    >
      {/* Header */}
      <Box sx={{p: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.1)", display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Removed back button as per new UX */}

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
            background: "rgba(255, 127, 50, 0.5)",
            borderRadius: "3px",
            "&:hover": {
              background: "rgba(255, 127, 50, 0.7)",
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
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
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
                          ? "rgba(255, 127, 50, 0.08)"
                          : "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "rgba(255, 127, 50, 0.12)",
                          borderColor: "#FF7F32",
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
                          color: "rgba(255, 127, 50, 0.8)",
                          "&.Mui-checked": {
                            color: "#FF7F32",
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
                          opacity: envProducts[product.id]?.isEnvironmentProduct
                            ? 1
                            : 0.5,
                        }}
                      />
                      <Box sx={{ flex: 1, ml: 2, overflow: 'hidden' }}>
                        <Typography
                          noWrap
                          sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: envProducts[product.id]?.isEnvironmentProduct
                              ? "white"
                              : "rgba(255, 255, 255, 0.5)",
                            fontSize: "1rem",
                            fontWeight: 600,
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.title}
                        </Typography>
                        
                        {envProducts[product.id]?.isEnvironmentProduct && (
                          <Box sx={{ display: "flex", gap: 0, mt: 1.5 }}>
                            <GlassButton
                              size="small"
                              onClick={() => {
                                setActiveProductId(product.id);
                                setMediaType(envProducts[product.id]?.type || "PHOTO");
                                setActiveTab("MEDIA");
                              }}
                              sx={{
                                py: 1, px: 2, flex: 1,
                                fontSize: '0.8rem',
                                minHeight: 'auto',
                                textTransform: 'none',
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.85)",
                                background: "rgba(255, 255, 255, 0.06)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                borderRadius: '12px 0 0 12px',
                                '&:hover': { background: "rgba(255, 255, 255, 0.1)" },
                              }}
                            >
                              Media
                            </GlassButton>
                            <GlassButton
                              size="small"
                              onClick={() => {
                                if (
                                  envProducts[product.id]?.imageIndex !== undefined ||
                                  envProducts[product.id]?.modelIndex !== undefined
                                ) {
                                  setParamsType(
                                    envProducts[product.id].placeHolderId !== undefined
                                      ? "PLACEHOLDER"
                                      : "CUSTOM"
                                  );
                                  setActiveProductId(product.id);
                                  setActiveTab("POSITION");
                                }
                              }}
                              disabled={
                                envProducts[product.id]?.imageIndex === undefined &&
                                envProducts[product.id]?.modelIndex === undefined
                              }
                              sx={{
                                py: 1, px: 2, flex: 1,
                                fontSize: '0.8rem',
                                minHeight: 'auto',
                                textTransform: 'none',
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.85)",
                                background: "rgba(255, 255, 255, 0.06)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                borderLeft: 'none',
                                borderRadius: '0 12px 12px 0',
                                '&:hover': { background: "rgba(255, 255, 255, 0.1)" },
                                '&.Mui-disabled': {
                                  background: 'rgba(255, 255, 255, 0.02)',
                                  color: 'rgba(255, 255, 255, 0.3)',
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  borderLeft: 'none',
                                }
                              }}
                            >
                              Position
                            </GlassButton>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </GlassBox>
            )}

            {/* Product Editor with Tabs */}
            {activeProductId && (
              <>
                <CompactTabPanel
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  mediaContent={
                    <>
                      <MediaTypeSelector
                        mediaType={mediaType}
                        onMediaTypeChange={setMediaType}
                      />
                      {(() => {
                        const product = products.find((p) => p.id === activeProductId);
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
                  }
                  positionContent={
                    activeEnvProduct && (
                      <>
                        <ParamsTypeSelector
                          paramsType={paramsType}
                          onParamsTypeChange={handleParamsTypeChange}
                        />
                        {paramsType === "CUSTOM" && (
                          <>
                            <Vector3Control
                              label="Position"
                              value={(activeEnvProduct.position as [number, number, number]) || [0, 0, 0]}
                              onChange={handlePositionChange}
                              min={-30}
                              max={30}
                              step={0.15}
                              icon={Move3D}
                            />
                            <Vector3Control
                              label="Rotation"
                              value={(activeEnvProduct.rotation as [number, number, number]) || [0, 0, 0]}
                              onChange={handleRotationChange}
                              min={-180}
                              max={180}
                              step={1}
                              icon={RotateCcw}
                            />
                            <GlassBox sx={{ p: 3, mb: 2 }}>
                              <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
                                <ZoomIn size={18} {...ORANGE_ICON_PROPS} />
                                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: "white", fontSize: "16px", fontWeight: 600 }}>
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
                            <FaceSelector value={activeEnvProduct.face} onChange={handleFaceChange} />
                          </>
                        )}
                        {paramsType === "PLACEHOLDER" && placeHolderData && (
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
                    )
                  }
                />
              </>
            )}
          </>
        )}

        {/* Assets Section */}
        {entityType === "ASSET" && (
          <>
            {!activeAssetId && (
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
                {assetSource === "OWN" && (
                  <FileUploadArea onUpload={handleFileUpload} />
                )}

                {/* Asset List */}
                <AssetList
                  assets={Object.values(envAssets).filter(
                    (asset) => asset.source === assetSource
                  )}
                  onCheckboxChange={handleCheckboxChange}
                  onDelete={handleDeleteAsset}
                  onEdit={setActiveAssetId}
                  onSetActiveTab={setAssetActiveTab}
                />
              </>
            )}

            {/* Asset Editor with Tabs */}
            {activeAssetId && activeEnvAsset && (
              <>
                <CompactTabPanel
                  activeTab={assetActiveTab}
                  onTabChange={setAssetActiveTab}
                  mediaContent={
                    <GlassBox sx={{ p: 3 }}>
                      <Typography
                        sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "white",
                          mb: 2,
                          textAlign: "center",
                        }}
                      >
                        Asset: {activeEnvAsset.name}
                      </Typography>

                      {activeEnvAsset.type === "PHOTO" && (
                        <Box
                          component="img"
                          src={activeEnvAsset.src}
                          sx={{
                            width: "100%",
                            maxHeight: "260px",
                            borderRadius: "12px",
                            objectFit: "contain",
                          }}
                        />
                      )}

                      {activeEnvAsset.type === "MODEL_3D" && (
                        <ModelViewer
                          style={{
                            width: "100%",
                            height: "260px",
                            backgroundColor: "rgb(15, 15, 15)",
                            borderRadius: "12px",
                          }}
                          data={{ id: activeEnvAsset.id, sources: [{ url: activeEnvAsset.src }], alt: activeEnvAsset.name }}
                          ar={false}
                          cameraControls
                          environmentImage="neutral"
                          poster=""
                        />
                      )}
                    </GlassBox>
                  }
                  positionContent={
                    <>
                      <Vector3Control
                        label="Position"
                        value={(activeEnvAsset.position as [number, number, number]) || [0, 0, 0]}
                        onChange={handlePositionChange}
                        min={-30}
                        max={30}
                        step={0.1}
                        icon={Move3D}
                      />
                      <Vector3Control
                        label="Rotation"
                        value={(activeEnvAsset.rotation as [number, number, number]) || [0, 0, 0]}
                        onChange={handleRotationChange}
                        min={-180}
                        max={180}
                        step={1}
                        icon={RotateCcw}
                      />
                      <GlassBox sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5, gap: 1 }}>
                          <ZoomIn size={18} {...ORANGE_ICON_PROPS} />
                          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", color: "white", fontSize: "16px", fontWeight: 700 }}>
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
                  }
                />
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
            Save and Deploy Store
          </GlassButton>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <GlassButton
              fullWidth
              onClick={() => {
                if (entityType === "PRODUCT" && previousProductState) {
                  modifyEnvProduct(previousProductState.id, previousProductState);
                  setActiveProductId(null);
                  setPreviousProductState(null);
                } else if (entityType === "ASSET" && previousAssetState) {
                  modifyEnvAsset(previousAssetState.id, previousAssetState);
                  setActiveAssetId(null);
                  setPreviousAssetState(null);
                } else {
                  // nothing to discard, just close
                  if (entityType === "PRODUCT") setActiveProductId(null); else setActiveAssetId(null);
                }
              }}
              startIcon={<Trash2 size={18} />}
            >
              Discard
            </GlassButton>

            <GlassButton
              isPrimary
              onClick={() => {
                if (entityType === "PRODUCT") {
                  setPreviousProductState(null);
                  setActiveProductId(null);
                } else {
                  setPreviousAssetState(null);
                  setActiveAssetId(null);
                }
              }}
              startIcon={<Check size={18} />}
              fullWidth
            >
              Done
            </GlassButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};
