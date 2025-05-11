
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const triviaData = [
  {
    id: 1,
    fact: "Lightning strikes the Earth about 100 times every second.",
    source: "National Geographic"
  },
  {
    id: 2,
    fact: "The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, California.",
    source: "World Meteorological Organization"
  },
  {
    id: 3,
    fact: "Snowflakes always have six sides.",
    source: "NOAA"
  },
  {
    id: 4,
    fact: "A hurricane can release energy equivalent to 10,000 nuclear bombs.",
    source: "NASA"
  },
  {
    id: 5,
    fact: "Rainbows are optical illusions; they don't exist in a specific spot.",
    source: "SciJinks - NOAA"
  },
  {
    id: 6,
    fact: "The 'smell of rain' is caused by a bacteria called actinomycetes.",
    source: "BBC Science Focus"
  },
  {
    id: 7,
    fact: "Venus has sulfuric acid rain, but it evaporates before reaching the surface due to extreme heat.",
    source: "NASA"
  },
  {
    id: 8,
    fact: "The windiest place on Earth is Commonwealth Bay, Antarctica.",
    source: "Guinness World Records"
  }
];

const WeatherTrivia = () => {
  const [currentTrivia, setCurrentTrivia] = useState(null);
  const [key, setKey] = useState(0); 

  const getRandomTrivia = () => {
    const randomIndex = Math.floor(Math.random() * triviaData.length);
    setCurrentTrivia(triviaData[randomIndex]);
    setKey(prevKey => prevKey + 1); 
  };

  useEffect(() => {
    getRandomTrivia();
  }, []);

  if (!currentTrivia) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="glass-card bg-indigo-600/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-yellow-300" /> Weather Trivia
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-white/90 text-md mb-3 min-h-[60px] flex items-center justify-center">
              {currentTrivia.fact}
            </p>
            <p className="text-xs text-white/60 mb-4">Source: {currentTrivia.source}</p>
          </motion.div>
          <Button
            onClick={getRandomTrivia}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Zap className="h-4 w-4 mr-2" /> New Fact
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherTrivia;
