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
          netlifyProjectID: "9ef7cead-445a-4617-bcb7-e1b01e812f77",
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
