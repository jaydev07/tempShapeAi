import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { join } from "path";
const router = express();
const subpath = express();

import orderRouter from "./order";
import userRouter from "./user";
import referralRouter from "./referral";
import webhookRouter from './webhook';
import payoutRouter from './payout';
import qaPortalRouter from './qa-portal';
import { adminAuth } from "../middlewares/admin";
import { sendPaymentConfirmationMail } from "../services/ses";

router.set('trust proxy', true);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(helmet());
router.use(
  cors({
    origin: "*",
  })
);
router.use('/v1/orders', orderRouter);
router.use('/v1/users', userRouter);
router.use('/v1/referrals', referralRouter);
router.use('/v1/webhook', webhookRouter);
router.use('/v1/qa', qaPortalRouter);
router.use('/v1/payouts', payoutRouter);
router.use('/v1', subpath);
const swagger = require("swagger-node-express").createNew(subpath);

router.use(express.static(join(__dirname, "../dist")));
router.set('trust proxy', true);

swagger.setApiInfo({
  title: "SHAPE AI Referral/Affiliate and Order/Payment Management API",
  description: "API to place orders and manage referrals",
  termsOfServiceUrl: "",
  contact: "shapeured@gmail.com",
  license: "",
  licenseUrl: "",
});

router.get("/", function (req, res) {
  if (process.env.NODE_ENV === "dev")
    res.sendFile(__dirname + "../dist/index.html");
  else res.status(200).send("ok");
});

router.post("/v1/webhook", (req, res) => {
  console.log(req.body);
  const { event } = req.body;
  if (event === "refund.created") {
  }

  console.log(req.body.payload.payment);
  res.send("ok");
});

router.post('/template-test', adminAuth, async (req, res) => {
  try {
    await sendPaymentConfirmationMail('shapeured@gmail.com', 'pay_' + Math.random().toString().substr(2,5))
  } catch (e) {
      res.status(500).send(e.toString())
  }
  res.send();
});

swagger.configure("http://localhost:4000", "1.0.0");

export default router;
