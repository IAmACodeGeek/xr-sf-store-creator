import bigRoomPlaceHolderData from "./placeHolderData/BigRoom";
import castlePlaceHolderData from "./placeHolderData/Castle";
import singleRoomPlaceHolderData from "./placeHolderData/SingleRoom";

import PlaceHolderData from "./placeHolderData/PlaceHolderData";
import ShowRoomPlaceHolderData from "./placeHolderData/ShowRoom";
import LotusDomePlaceHolderData from "./placeHolderData/LotusDome";
import LunoxPlaceHolderData from "./placeHolderData/Lunox";
import ShelfscapePlaceHolderData from "./placeHolderData/Shelfscape";
import KidsStorePlaceHolderData from "./placeHolderData/KidsStore";
import ArcadeZonePlaceHolderData from "./placeHolderData/ArcadeZone";
import VarsityVaultPlaceHolderData from "./placeHolderData/VarsityVault";
import GlowBarPlaceHolderData from "./placeHolderData/Glowbar";
import LuxeCradlePlaceHolderData from "./placeHolderData/LuxeCradle";
import FlareSuitePlaceHolderData from "./placeHolderData/FlareSuite";
import GardenAtlierPlaceHolderData from "./placeHolderData/GardenAtelier";
import CocktailDenPlaceHolderData from "./placeHolderData/CocktailDen";

interface EnvironmentData {
  [environment_name: string]: {
    playerSpeed: number;
    playerHeight: number;
    placeHolderData: PlaceHolderData[];
    initialGSAP: {
      start: {
        position: [number, number, number];
        rotation: [number, number, number];
        duration: number;
      };
      update: {
        position: [number, number, number];
        rotation: [number, number, number];
        duration: number;
        ease?: string;
      }[];
    };
    televisions: {
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
    }[];
    brandPosters: {
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
    }[];
    compasses: {
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
      dark?: boolean;
    }[];
    maxThreshold: number;
  };
}

const environmentData: EnvironmentData = {
  BIGROOM: {
    playerSpeed: 10,
    playerHeight: 2,
    maxThreshold: 30 * 1024 * 1024, // 30 MB limit
    placeHolderData: bigRoomPlaceHolderData,
    initialGSAP: {
      start: {
        position: [40, 4, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [40, 4, 0],
          rotation: [0, 270, 0],
          duration: 5,
        },
        {
          position: [20, 3.2, 0],
          rotation: [0, 270, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [47.8, 4.5, 0],
        rotation: [0, 180, 0],
        scale: 0.37,
      },
    ],
    brandPosters: [
      {
        position: [-5, 3.2, 14.3],
        rotation: [0, 90, 0],
        scale: 4,
      },
      {
        position: [-5, 3.2, -12.4],
        rotation: [0, 90, 0],
        scale: 4,
      },
    ],
    compasses: [],
  },

  CASTLE: {
    playerSpeed: 17,
    playerHeight: 2,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: castlePlaceHolderData,
    initialGSAP: {
      start: {
        position: [-4.62, 2.3, 46],
        rotation: [0, -30, 0],
        duration: 0,
      },
      update: [
        {
          position: [10, 2.5, -25],
          rotation: [0, 0, 0],
          duration: 4,
          ease: "power2.inOut",
        },
      ],
    },
    televisions: [
      {
        position: [-7.3, 33, -136.5],
        rotation: [0, 276, 0],
        scale: 0.8,
      },
    ],
    brandPosters: [
      {
        position: [-3.2, 10, -84],
        rotation: [2, 90, 0],
        scale: 5,
      },
    ],
    compasses: [],
  },

  SINGLEROOM: {
    playerSpeed: 15,
    playerHeight: 2,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: singleRoomPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 3, 0],
        rotation: [0, 0, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 4, 0],
          rotation: [0, 360, 0],
          duration: 5,
        },
        {
          position: [0, 3.2, 18],
          rotation: [0, 360, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [0, 4.5, -17.1],
        rotation: [0, -90, 0],
        scale: 0.6,
      },
    ],
    brandPosters: [
      {
        position: [9, 4.5, -17.1],
        rotation: [0, 0, 0],
        scale: 3,
      },
      {
        position: [-9, 4.5, -17.1],
        rotation: [0, 0, 0],
        scale: 3,
      },
    ],
    compasses: [
      {
        position: [0, -0.444, 6],
        rotation: [-90, 0, 0],
        scale: 5,
      },
    ],
  },
  SHOWROOM: {
    playerSpeed: 15,
    playerHeight: 7,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: ShowRoomPlaceHolderData,
    initialGSAP: {
      start: {
        position: [-20, 7, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [30, 10, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [11, 10, -23.5],
        rotation: [0, -90, 0],
        scale: 1,
      },
    ],
    brandPosters: [
      {
        position: [-22.5, 10, 0],
        rotation: [0, 90, 0],
        scale: 5,
      },
    ],
    compasses: [
      {
        position: [13, 0.4, 0],
        rotation: [-90, 0, 0],
        scale: 7,
      },
    ],
  },
  LOTUSDOME: {
    playerSpeed: 15,
    playerHeight: 1.5,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: LotusDomePlaceHolderData,
    initialGSAP: {
      start: {
        position: [10, 5, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [-22, 4, 6],
        rotation: [0, 10, 0],
        scale: 0.3,
      },
    ],
    brandPosters: [
      {
        position: [-22, 4, -6],
        rotation: [0, 80, 0],
        scale: 2.5,
      },
      {
        position: [-18.686, 4, 13.965],
        rotation: [0, 123.0, 0],
        scale: 2.5,
      },
    ],
    compasses: [
      {
        position: [0, 0.4, 0],
        rotation: [-90, 0, 0],
        scale: 3,
      },
    ],
  },
  LUNOX: {
    playerSpeed: 8,
    playerHeight: 2,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: LunoxPlaceHolderData,
    initialGSAP: {
      start: {
        position: [10, 5, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [-34, 5.2, 0],
        rotation: [0, 0, 0],
        scale: 0.45,
      },
    ],
    brandPosters: [
      {
        position: [17.2, 5, 7],
        rotation: [0, -90, 0],
        scale: 2.5,
      },
      {
        position: [17.2, 5, -8],
        rotation: [0, -90, 0],
        scale: 2.5,
      },
    ],
    compasses: [
      {
        position: [-8, 0.1, -0.4],
        rotation: [-90, 0, 0],
        scale: 5,
        dark: true,
      },
    ],
  },
  SHELFSCAPE: {
    playerSpeed: 8,
    playerHeight: 3.5,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: ShelfscapePlaceHolderData,
    initialGSAP: {
      start: {
        position: [10, 7, -2],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 5, -2],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [5, 7, -2],
        rotation: [0, 180, 0],
        scale: 0.45,
      },
    ],
    brandPosters: [
      {
        position: [5.5, 7, 7],
        rotation: [0, -90, 0],
        scale: 2.5,
      },
      {
        position: [5.5, 7, -11],
        rotation: [0, -90, 0],
        scale: 2.5,
      },
    ],
    compasses: [
      {
        position: [-16, 1.2, -2],
        rotation: [-90, 0, 0],
        scale: 5,
      },
    ],
  },
  KIDSSTORE: {
    playerSpeed: 8,
    playerHeight: 2.5,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: KidsStorePlaceHolderData,
    initialGSAP: {
      start: {
        position: [10, 5, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [11.6, 4, -1],
        rotation: [0, 180, 0],
        scale: 0.35,
      },
    ],
    brandPosters: [
      {
        position: [-14.1, 7.4, -5.6],
        rotation: [0, 90, 0],
        scale: 2,
      },
    ],
    compasses: [
      {
        position: [-2.5, 0.1, 1],
        rotation: [-90, 0, 0],
        scale: 5,
      },
    ],
  },
  ARCADEZONE: {
    playerSpeed: 10,
    playerHeight: 1.5,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: ArcadeZonePlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 4, 10],
        rotation: [0, 180, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3, -20],
          rotation: [0, 180, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [0.13, 2.5, 2.5],
        rotation: [0, 90, 0],
        scale: 0.27,
      },
    ],
    brandPosters: [
      {
        position: [0, 3.5, -21],
        rotation: [0, 0, 0],
        scale: 3,
      },
    ],
    compasses: [
      {
        position: [0, -0.8, -8.2],
        rotation: [-90, 0, 0],
        scale: 5,
        dark: true,
      },
    ],
  },
  VARSITYVAULT: {
    playerSpeed: 15,
    playerHeight: 2.5,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: VarsityVaultPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 4, 10],
        rotation: [0, 180, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 3, -20],
          rotation: [0, 180, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [7, 4, -27.6],
        rotation: [0, -90, 0],
        scale: 0.4,
      },
    ],
    brandPosters: [
      {
        position: [3, 5, 29],
        rotation: [0, 180, 0],
        scale: 2.5,
      },
    ],
    compasses: [
      {
        position: [0, -0.8, -8.2],
        rotation: [-90, 0, 0],
        scale: 5,
        dark: true,
      },
    ],
  },
  GLOWBAR: {
    playerSpeed: 10,
    playerHeight: 3,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: GlowBarPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 0],
        rotation: [0, 135, 0],
        duration: 0,
      },
      update: [
        {
          position: [15.373, 6, -7.952],
          rotation: [0, 135, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [18.6, 6, 0],
        rotation: [0, 180, 0],
        scale: 0.5,
      },
    ],
    brandPosters: [
      {
        position: [-18.6, 6, -3.5],
        rotation: [0, 90, 0],
        scale: 4,
      },
    ],
    compasses: [
      {
        position: [-0.5, 0.1, 0],
        rotation: [-90, 0, 0],
        scale: 4,
      },
    ],
  },
  LUXECRADLE: {
    playerSpeed: 10,
    playerHeight: 3,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: LuxeCradlePlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [15.373, 6, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [18.6, 6, 0],
        rotation: [0, 180, 0],
        scale: 0.5,
      },
    ],
    brandPosters: [
      {
        position: [-18.6, 6, 1],
        rotation: [0, 90, 0],
        scale: 3,
      },
    ],
    compasses: [
      {
        position: [0, 0.1, 0],
        rotation: [-90, 0, 0],
        scale: 4,
      },
    ],
  },
  FLARESUITE: {
    playerSpeed: 10,
    playerHeight: 2.5,
    maxThreshold: 30 * 1024 * 1024,
    placeHolderData: FlareSuitePlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 0],
        rotation: [0, 90, 0],
        duration: 0,
      },
      update: [
        {
          position: [15, 5, 0],
          rotation: [0, 90, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [-26, 6, 0],
        rotation: [0, 0, 0],
        scale: 0.5,
      },
    ],
    brandPosters: [
      {
        position: [26.5, 6, 0],
        rotation: [0, -90, 0],
        scale: 3,
      },
    ],
    compasses: [
      {
        position: [0, 0.1, -5.5],
        rotation: [-90, 0, 0],
        scale: 5,
        dark: true,
      },
    ],
  },
  GARDENATELIER: {
    playerSpeed: 10,
    playerHeight: 3,
    maxThreshold: 30 * 1024 * 1024, //30MB
    placeHolderData: GardenAtlierPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 5, 0],
        rotation: [0, 180, 0],
        duration: 0,
      },
      update: [
        {
          position: [0, 5, -10],
          rotation: [0, 180, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [0, 6, 23.5],
        rotation: [0, 90, 0],
        scale: 0.4,
      },
    ],
    brandPosters: [
      {
        position: [-0.1, 7, -20],
        rotation: [0, 0, 0],
        scale: 2.8,
      },
    ],
    compasses: [
      {
        position: [0, 0.1, -2],
        rotation: [-90, 0, 0],
        scale: 5,
      },
    ],
  },
  COCKTAILDEN: {
    playerSpeed: 10,
    playerHeight: 5,
    maxThreshold: 30 * 1024 * 1024, //30MB
    placeHolderData: CocktailDenPlaceHolderData,
    initialGSAP: {
      start: {
        position: [0, 6, 0],
        rotation: [0, 45, 0],
        duration: 0,
      },
      update: [
        {
          position: [22, 6, 22],
          rotation: [0, 45, 0],
          duration: 2,
        },
      ],
    },
    televisions: [
      {
        position: [4.102, 10.115, 22.392],
        rotation: [0, 90, 0],
        scale: 0.6,
      },
    ],
    brandPosters: [
      {
        position: [22.875, 10.115, -0.785],
        rotation: [0, -90, 0],
        scale: 4,
      },
    ],
    compasses: [
      {
        position: [16, -1.5, 16],
        rotation: [-90, 0, 0],
        scale: 5,
      },
    ],
  },
};

export default environmentData;
