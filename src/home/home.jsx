import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";

const HomePage = (percentage) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (percentage.percentage >= 100) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [percentage.percentage]);

  const topVariants = {
    exit: {
      y: -1000,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  const bottomVariants = {
    exit: {
      y: 1000,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };
  const middleVariants = {
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-screen h-[100svh] overflow-hidden relative">
      <AnimatePresence>
        {loading && (
          <>
            <motion.div
              variants={topVariants}
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              exit="exit"
              className="w-full h-1/2 bg-black"
            />
            <motion.div
              variants={middleVariants}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit="exit"
              className="w-full h-[1px] bg-black flex justify-center items-center"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${percentage.percentage}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="h-[1px] bg-white"
              />
            </motion.div>
            <motion.div
              variants={bottomVariants}
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              exit="exit"
              className="w-full h-1/2 bg-black"
            />
          </>
        )}
      </AnimatePresence>

      {/* Main content goes here */}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: !loading ? 1 : 0,
          y: !loading ? 0 : 50,
        }}
        transition={{ delay: 1, duration: 1, easeInOut }} // Delay to ensure it runs after loader disappears
        className="relative z-0 w-full h-full flex flex-col justify-between items-center pt-10 pb-14 select-none"
      >
        <div className="flex flex-col justify-center items-center gap-4">
          <img src="/bmwLogo.svg" alt="BMW" className="size-12" />
          <h1 className="uppercase text-lg lg:text-2xl text-center">
            Present yourself in an elegant way
          </h1>
        </div>
        <div className="w-96 h-[75px] flex flex-col justify-between items-center">
          <div className="bg-gradient-to-r from-white/0 via-white/35 to-white/0 h-[1px] w-full" />
          <div className="w-full h-full flex flex-row justify-evenly items-center">
            <button
              id="RedGold"
              className="gradient-gold size-12 rounded-full border border-black pointer-events-auto cursor-pointer"
            />
            <button
              id="Red"
              className="gradient-red size-12 rounded-full border border-black pointer-events-auto cursor-pointer"
            />
            <button
              id="BluePurple"
              className="gradient-blue-purple size-12 rounded-full border border-black pointer-events-auto cursor-pointer"
            />
            <button
              id="Black"
              className="gradient-black size-12 rounded-full border border-black pointer-events-auto cursor-pointer"
            />
          </div>
          <div className="bg-gradient-to-r from-white/0 via-white/35 to-white/0 h-[1px] w-full" />
        </div>
        <p className="w-lvw font-thin text-white/50 text-sm mb-2 absolute bottom-0 text-center">
          Designed by Emiro
        </p>
      </motion.div>
    </div>
  );
};

export default HomePage;
