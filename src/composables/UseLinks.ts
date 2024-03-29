export interface Link {
  text: string;
  url?: string;
}

export const useLinks = () => {
  const socialNetworks: Link[] = [
    {
      text: 'GitHub',
      url: 'https://github.com/juananmuxed',
    },
    { text: 'Mastodon', url: 'https://masto.es/@muxed' },
    {
      text: 'LinkedIn',
      url: 'https://www.linkedin.com/in/jasmmuxed/',
    },
  ];

  const gitHubProjects: Link[] = [
    {
      text: 'MuXeD',
      url: `${getSocialNetworkByText('github')?.url}/muxed`,
    },
    {
      text: 'Clash of Spears Army Builder',
      url: `${getSocialNetworkByText('github')?.url}/cod-sheet-creator`,
    },
    {
      text: 'RPG Utils',
      url: `${getSocialNetworkByText('github')?.url}/rpg-utils`,
    },
    {
      text: 'DNI Utils',
      url: `${getSocialNetworkByText('github')?.url}/dni-utils`,
    },
    {
      text: 'MuXBoT RPG',
      url: `${getSocialNetworkByText('github')?.url}/muxbot-rpg`,
    },
    {
      text: 'TeamCoo',
      url: `${getSocialNetworkByText('github')?.url}/teamcoo`,
    },
  ];

  function getSocialNetworkByText(name: string): Link | undefined {
    return socialNetworks.find(
      (sn) => sn.text.toLocaleLowerCase() === name.toLocaleLowerCase(),
    );
  }

  return {
    socialNetworks,
    gitHubProjects,
    getSocialNetworkByText,
  };
};
