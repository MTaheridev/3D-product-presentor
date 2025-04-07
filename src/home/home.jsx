import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, delay, easeInOut } from "framer-motion";

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading complete after 3 seconds (adjust as needed)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Variants for the white loader bar
  const loaderVariants = {
    initial: { width: "0%" },
    animate: { width: "100%", transition: { duration: 5, ease: "easeInOut" } },
  };

  // Variants for the top black div
  const topVariants = {
    exit: {
      y: -1000,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  // Variants for the bottom black div
  const bottomVariants = {
    exit: {
      y: 1000,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };
  const middleVariants = {
    exit: { opacity: 0, transition: { duration: 0.5 } }, // Middle div disappears first
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
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
                variants={loaderVariants}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
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
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 6, duration: 1, easeInOut }} // Delay to ensure it runs after loader disappears
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
          designed and framed by:{" "}
          <a
            href="mailto:mohammadtaheri.dev@gmail.com"
            className="underline text-white/80 pointer-events-auto cursor-pointer"
          >
            This Guy
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default HomePage;
