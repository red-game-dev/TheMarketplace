export const endpoints = {
  // Auth
  login: {
    url: '/auth/login',
    method: 'POST',
  },

  // Profile
  getUserProfile: {
    url: '/users/:walletAddress',
    method: 'GET',
  },
  getUserProfileByUsername: {
    url: '/users/by-username/:username',
    method: 'GET',
  },
  updateUserProfile: {
    url: '/users/profile',
    method: 'PUT',
  },

  // NFTs
  getNFTs: {
    url: '/nfts/:walletAddress',
    method: 'GET',
  },
  getTransactionStatus: {
    url: '/nfts/transaction/:id',
    method: 'GET',
  },
  transferNFT: {
    url: '/nfts/transfer/:walletAddress',
    method: 'POST',
  },
  updateTransactionStatus: {
    url: '/nfts/transaction/:id',
    method: 'PUT',
  },

  // Transaction endpoints
  getTransactions: {
    url: '/transactions/:walletAddress',
    method: 'GET',
  },
};
