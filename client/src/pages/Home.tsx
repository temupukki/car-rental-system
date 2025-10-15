import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Camera,
  Car,
  HandCoins,
  MapPinCheckInside,
  Wallet,
} from "lucide-react";

export default function Home() {
  return (
    <div>
      <div className="mx-16 h-[480px] bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl grid grid-cols-3 gap-4 mt-3 ">
        <div className="col-span-2">
          <h1 className="font-bold text-white text-4xl pt-40 pl-14">
            Experience the road like never before
          </h1>
          <p className="text-white pt-4 pl-14">
            sncosncsndcknsdcisduicnosdcnsdiocnsldcnosdncosdnc
            odsnclsdncosdncosdncsldncosdncsodncosdncosdncosdncosd
            ncosdncosdncosdcnosdnc osdncsodncldn oasknclkdnciondcjioswncor
          </p>
          <button className="bg-orange-400 text-white font-bold rounded-2xl mt-10 ml-14 w-[130px] h-10">
            View all cars
          </button>
        </div>
        <div className="col-span-1">
          <Card className="bg-white m-10 w-[18rem]  rounded-xl shadow-lg border border-gray-200 ">
            <CardHeader>
              <CardTitle className="font-semibold text-center text-2xl text-gray-800">
                Book your car
              </CardTitle>
              <CardDescription className="text-center text-gray-500 mt-2">
                Everything you need to hit the road.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                <li>Wide selection of vehicles</li>
                <li>Flexible pick-up & drop-off</li>
                <li>Real-time availability</li>
                <li>24/7 customer support</li>
                <li>Flexible pick-up & drop-off</li>
                <li>Real-time availability</li>
                <li>24/7 customer support</li>
              </ul>

              <a href="/signup">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 1.04 }}
                  className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white h-12 rounded-xl"
                >
                  Sign Up to Book
                </motion.button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.08, x: 3 }}
          className="col-span-1 ml-[13rem] my-[6rem]"
        >
          <MapPinCheckInside size={80} />
          <p className="my-6 text-4xl font-bold mx-[-42px]">Avaliability</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08, x: 3 }}
          className="col-span-1 ml-[13rem] my-[6rem]"
        >
          <Car size={80} />
          <p className="my-6 text-4xl font-bold mx-[-42px]">Comfort</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08, x: 3 }}
          className="col-span-1 ml-[13rem] my-[6rem]"
        >
          <Wallet size={80} />
          <p className="my-6 text-4xl font-bold mx-[-42px]">Savings</p>
        </motion.div>
      </div>
    </div>
  );
}
