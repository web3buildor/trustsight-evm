import fs from "fs";
import { createCanvas, loadImage } from "canvas";
import jdenticon from "jdenticon";
import { Web3Storage, File, Blob } from "web3.storage";
import Identicon from "identicon.js";
import * as dotenv from "dotenv";
dotenv.config();

const WEB3_STORAGE_TOKEN = process.env.WEB3_STORAGE_API_KEY ?? "";

const client = new Web3Storage({
  token: WEB3_STORAGE_TOKEN,
  endpoint: new URL("https://api.web3.storage"),
});

function abridgeAddress(address: string) {
  if (!address) return address;
  const l = address.length;
  if (l < 20) return address;
  return `${address.substring(0, 6)}...${address.substring(l - 6, l)}`;
}

export async function fetchSBTTokenURI(
  address: string,
  username: string,
  imageURL: string,
  score: number,
  numReviews: number
) {
  const canvas = createCanvas(660, 660);
  const context = canvas.getContext("2d");

  // construct background gradient
  const gradient = context.createLinearGradient(330, 0, 330, 660);
  gradient.addColorStop(0, "#FFFFFF");
  gradient.addColorStop(1, "#D1E4FF");

  // draw background gradient
  roundRect(context, 0, 0, 660, 660, 20, gradient);

  // draw profile or identicon
  if (imageURL) {
    roundRect(context, 30, 30, 250, 250, 20);
    context.save();
    context.clip();
    const identicon = await loadImage(imageURL);
    context.drawImage(identicon, 30, 30, 250, 250);
    context.restore();
  } else {
    const png: Buffer = jdenticon.toPng(address, 190);
    const identicon = await loadImage(png);
    context.drawImage(identicon, 30, 30, 260, 260);
  }

  // draw footer logo
  const logo = await loadImage("./src/logo2.png");
  context.drawImage(logo, 310, 590, 160, 32);

  context.textBaseline = "top";
  context.fillStyle = "#000000";
  context.font = "bold 20px Helvetica Neue";
  context.fillText("Certified by", 192, 595);

  // draw address
  context.textBaseline = "top";
  context.fillStyle = "#000000";
  context.font = `bold 74px Helvetica Neue`;
  context.fillText(username ?? abridgeAddress(address), 50, 290);

  // draw address
  context.textBaseline = "top";
  context.fillStyle = "#7B7B7B";
  context.font = `bold 46px Helvetica Neue`;
  context.fillText(abridgeAddress(address), 50, 385);

  // draw score
  context.textBaseline = "top";
  context.fillStyle = "#000000";
  context.font = `bold 36px Helvetica Neue`;
  context.fillText(score.toFixed(2), 340, 452);

  // draw score
  context.textBaseline = "top";
  context.fillStyle = "#7B7B7B";
  context.font = `bold 30px Helvetica Neue`;
  context.fillText(`· ${numReviews} reviews`, 420, 455);

  // draw star
  const star = await loadImage("./src/star.png");
  const greystar = await loadImage("./src/greystar.png");
  for (let i = 0; i < 5; i++) {
    if (i < Math.round(score)) {
      context.drawImage(star, 50 + i * 55, 450, 50, 50);
    } else {
      context.drawImage(greystar, 50 + i * 55, 450, 50, 50);
    }
  }

  const buffer = canvas.toBuffer("image/png");
  // await fs.writeFileSync("./image.png", buffer);
  // return;

  // upload image to web3.storage
  const blob = new Blob([buffer], { type: "image/png" });
  const imageToUpload = [new File([blob], "file.png")];
  const imageCID = await client.put(imageToUpload);
  const imageLink = `https://${imageCID}.ipfs.dweb.link/file.png`;

  const metadataJSON = {
    name: "TrustSight SoulBound Profile Token",
    description: `TrustSight SoulBound Profile Token for ${address}`,
    image: imageLink,
    image_url: imageLink,
    attributes: [
      {
        trait_type: "Trust Score",
        value: score,
      },
    ],
  };

  const jsonBlob = new Blob([JSON.stringify(metadataJSON)], {
    type: "application/json",
  });

  const files = [new File([jsonBlob], "metadata.json")];
  const jsonCID = await client.put(files);
  const jsonLink = `https://${jsonCID}.ipfs.w3s.link/metadata.json`;

  return jsonLink;
}

// fetchSBTTokenURI(
//   "0x078F651c82da4800d654351bBE07d4B535B21DfA",
//   "this is my name",
//   "https://bafybeif4w4kyhf622cf34efk5tks3rqpdsogptj4lbzn3j6k72e3xwimmm.ipfs.w3s.link/image.png",
//   4.2819,
//   28
// ).catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// helper function to draw rounded rectangles
function roundRect(
  ctx: any,
  x: any,
  y: any,
  width: any,
  height: any,
  radius: any,
  fillColor?: any,
  strokeColor?: any
) {
  let radiusObj: any = {};
  if (typeof radius === "number") {
    radiusObj = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radiusObj = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radiusObj.tl, y);
  ctx.lineTo(x + width - radiusObj.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radiusObj.tr);
  ctx.lineTo(x + width, y + height - radiusObj.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radiusObj.br,
    y + height
  );
  ctx.lineTo(x + radiusObj.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radiusObj.bl);
  ctx.lineTo(x, y + radiusObj.tl);
  ctx.quadraticCurveTo(x, y, x + radiusObj.tl, y);
  ctx.closePath();
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }
}
