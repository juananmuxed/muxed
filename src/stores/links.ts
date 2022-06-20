import { defineStore } from "pinia";

export interface Link {
  text: string;
  url?: string;
}

export const useLinks = defineStore("links", () => {
  const socialNetworks: Link[] = [
    {
      text: "GitHub",
      url: "https://github.com/juananmuxed",
    },
    { text: "Twitter", url: "https://twitter.com/muxed" },
    {
      text: "LinkedIn",
      url: "https://www.linkedin.com/in/jasmmuxed/",
    },
  ];

  const gitHubProjects: Link[] = [
    {
      text: "TeamCoo",
      url: getSocialNetworkByText("github")?.url + "/teamcoo",
    },
    {
      text: "MuXeD",
      url: getSocialNetworkByText("github")?.url + "/muxed",
    },
    {
      text: "RPG Utils",
      url: getSocialNetworkByText("github")?.url + "/rpg-utils",
    },
    {
      text: "DNI Utils",
      url: getSocialNetworkByText("github")?.url + "/dni-utils",
    },
    {
      text: "MuXBoT RPG",
      url: getSocialNetworkByText("github")?.url + "/muxbot-rpg",
    },
  ];

  function getSocialNetworkByText(name: string): Link | undefined {
    return socialNetworks.find(
      (sn) => sn.text.toLocaleLowerCase() === name.toLocaleLowerCase()
    );
  }

  return {
    socialNetworks,
    gitHubProjects,
    getSocialNetworkByText,
  };
});
