# Ethereum&amp;Solidity Course Final Project (CrowdCoin/Kickstarter clone)

The final and the largest project from the Ethereum&amp;Solidity course with Next.js and Solidity.

## Table of contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Setup](#setup)
- [Deployment](#deployment-to-vercel)
- [Features](#features)
- [The project status](#the-project-status)
- [Sources](#sources)

## Introduction

This is a training project in which everything learned during the course is used together to create a Kickstarter clone.  
The aim of this project is to create a more secured version of **Kickstarter** using **smart contracts** written in the **Solidity** language.

## Technologies

The following technologies/libraries were used in the creation of this project:

- React 17.0.0
- Next.js 12.1.5
- Solidity 0.8.12
- Web3 1.7.1
- FS Extra 10.0.1
- Solidity Compiler 0.8.12 (solc)
- Semantic Ui React 2.1.2
- Semantic Ui Css 2.4.1
- Dotenv 16.0.0
- Truffle HDWallet Provider 2.0.3
- Ganache CLI 6.12.2
- Mocha 9.2.1

## Setup

Here are the steps necessary to be able to run the project locally.

### Install dependencies

After cloning the repo run the following command to install the necessary dependencies:

```console
npm install
```

### Create MetaMask account

At first you won't have any deployed contracts so the first step is to create a MetaMask account.  
Use Chrome or Firefox for this. You will need the accounts created through MetaMask for testing  
and to deploy any smart contracts to Rinkeby or Mainnet networks.

### Compile and deploy the **Factory** contract

Run this code to compile the Solidity code from the Campaign.sol file located at (./ethereum/contracts/)  
and to save it in a **build** folder. You will need both the **abi** and **evm** objects from it for the next step.

```console
npm run compile
```

When the compiling is finished and you see a **build** folder, you can follow up with the command below.  
This will deploy the **Factory** contract to the Rinkeby Test Network. (make changes here if you would like to deploy elsewhere)  
The address where your contract was deployed to will be saved in a file called **deployed-contract-address.json**, this  
will be used when your application is running to deploy a second contract aka when you create a new campaign.

```console
npm run deploy
```

## Start the local Next.js server

Run the following code to start a local server for development.

```console
npm run dev
```

## Deployment (to Vercel)

Make sure the project is saved to a **Github** repo of your own, then use the following link [Vercel Docs](https://vercel.com/docs "Vercel Docs").  
Follow the guide there to quickly deploy your project to Vercel which is made specifically for Next.js projects.  
**Disclaimer** you can use any method you know to deploy your project elsewhere, it is not mandatory to use the Vercel approach.

## Features

- Deploy your own Kickstarter clone powered by Next.js and Solidity
- Create campaigns for awesome projects that can receive contributions from people
- As the manager of such a campaign create requests that will help reach the campaign's goal
- As a contributor you can decide to approve or decline a request for a campaign if it seems disingenuous
- As the manager you can finalize a request if enough people approved it
- Finally the person whose address is stored in such a request will receive the money he needs to fulfill his part of the job

## The project status

The project was primarily created for learning and training purposes, it is not production ready.
This does not mean however that with some changes and improvements it can't become ready.

## Sources

This is a modified version of a project from the Udemy course **Ethereum and Solidity: The Complete Developer's Guide** by Stephen Grider.  
[Ethereum and Solidity course](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/ "Ethereum and Solidity course")
