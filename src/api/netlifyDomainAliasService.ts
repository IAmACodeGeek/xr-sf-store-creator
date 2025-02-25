const NETLIFY_DOMAIN_ALIAS =
  "https://function-12-934416248688.us-central1.run.app";

const NetlifyDomainAliasService = {
  createDomainAlias: async function (brandName: string) {
    try {
      const response = await fetch(NETLIFY_DOMAIN_ALIAS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          netlifyProjectID: "6d75d5a1-68af-49cd-9851-3aeea316179c",
          new_domain_alias: `${brandName}.strategyfox.in`,
        }),
      });
      const result = response.text();
      return result;
    } catch (error) {
      console.error(error);
    }
  },
};

export default NetlifyDomainAliasService;
