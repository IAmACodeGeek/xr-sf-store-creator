const CNAME_RECORD_CREATION_URL =
  "https://function-13-934416248688.us-central1.run.app";

const CNAMERecordService = {
  createCNAMERecord: async function (brandName: string) {
    try {
      const response = await fetch(CNAME_RECORD_CREATION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zone_id: "c0ca3e15d01efc909a0b0bbdf0b37de5",
          name: brandName,
          content: "xr-sf-r3f-test.netlify.app",
          proxied: false,
        }),
      });
      const result = response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  },
};

export default CNAMERecordService;
