# SynthetixStaleArticles

## Getting started

```bash
git clone https://github.com/darx/SynthetixStaleArticles.git
cd SynthetixStaleArticles
npm install
```

## Setup environmental variables

```bash
echo -e "SYNAPPS_APPLICATIONKEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\SYNAPPS_CONSUMERKEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\SYNAPPS_AUTHORIZATION=Bearer xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" > .env
```

## Running script

Date format: MM-DD-YYYY

```bash
node .\src\index.js  --start 10-24-2020 --end 10-24-2021
```
