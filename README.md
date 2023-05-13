# TrustSight: A Web3 Reputation Platform Powered by EigenTrust for Crowdsourcing On-Chain Trust

## Problem Statement

In the rapidly evolving world of web3, identifying legitimate actors and avoiding malicious ones on-chain can be a daunting task, particularly for beginners. New users may struggle to find reputable DeFi, NFT, or DAO projects, and it can be challenging to determine if a contract is legitimate or a scam. While experienced users may rely on metrics like TVL or seek advice from experts, these methods aren't always accessible for newcomers, leaving them vulnerable to scams, rug pulls, and phishing schemes.

Two key questions arise:
- How can the community collectively assess the legitimacy of accounts and contracts?
- How can we create a seamless user experience to showcase this "legitimacy," especially for beginners?

## Introducing TrustSight

To address these challenges, we have developed TrustSight, a platform designed to crowdsource reputation for on-chain actors by leveraging the power of the EigenTrust algorithm.

TrustSight operates as follows:
1. Crowdsourcing trust scores on-chain from users about other accounts through the TrustScoreRegistry contract.
2. Utilizing a simple, non-distributed EigenTrust algorithm to compute global trust scores for all actors within the network.
3. Showcasing these scores in a user-friendly, beginner-oriented interface.

## Key Features

- **Read reviews for on-chain addresses**: TrustSight enables users to access and read reviews about other on-chain addresses, providing valuable insights into their reputation.
- **Write reviews for on-chain addresses**: Users can contribute to the platform by writing reviews for other on-chain addresses, fostering a collaborative approach to trust-building.
- **Check addresses for maliciously flagged actors**: TrustSight allows users to verify if an address has been flagged as potentially malicious, helping to avoid scams and safeguard investments.
- **Assess project legitimacy**: TrustSight enables users to evaluate projects based on their trust scores, ensuring a safer and more informed decision-making process.
- **Discover top-rated projects**: Users can explore the highest-rated addresses on TrustSight to find reputable projects, simplifying the search for trustworthy opportunities.
- **EigenTrust re-computation cron job**: TrustSight employs a cron job to regularly update trust scores, ensuring that users have access to the most up-to-date information.

In summary, TrustSight is a groundbreaking web3 reputation platform that leverages the EigenTrust algorithm to crowdsource on-chain trust, making it easier for users of all experience levels to navigate the blockchain space securely. With features such as reading and writing reviews, flagging malicious actors, evaluating project legitimacy, and discovering top-rated projects, TrustSight provides a seamless and user-friendly experience for building trust and credibility in the world of web3.
