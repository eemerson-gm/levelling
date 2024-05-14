"use client";

import { Checkbox } from "@/components/checkbox";
import { Menu } from "@/components/menu";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Coffee, Wind, Zap } from "react-feather";

const iconSize = "64";
const baseLevelExperience = 100;
const baseGainExperience = 10;

const skills = {
  strength: {
    icon: <Zap size={iconSize} />,
    quests: [
      {
        name: "Complete 10 push-ups",
        points: 1,
      },
      {
        name: "Complete 30 sit-ups",
        points: 1,
      },
      {
        name: "Lift 50 reps of weights",
        points: 1,
      },
    ],
  },
  dexterity: {
    icon: <Wind size={iconSize} />,
    quests: [
      {
        name: "Don't eat 12 hours",
        points: 1,
      },
      {
        name: "Consume under 2000 calories",
        points: 1,
      },
      {
        name: "Complete a 2km run",
        points: 3,
      },
    ],
  },
  cooking: {
    icon: <Coffee size={iconSize} />,
    quests: [
      {
        name: "Make a meal",
        points: 1,
      },
      {
        name: "Learn a new recipe",
        points: 3,
      },
    ],
  },
};

interface SaveData {
  level: number;
  experience: number;
  complete_date: string;
  skills: {
    [key: string]: {
      points: number;
      quests: boolean[];
    };
  };
}

const fibonacci = (n: number): number => {
  return n < 1 ? 0 : n <= 2 ? 1 : fibonacci(n - 1) + fibonacci(n - 2);
};

const Home = () => {
  const [saveData, setSaveData] = useState<SaveData>();
  const [selectedQuest, setSelectedQuest] =
    useState<keyof typeof skills>("strength");

  const levelExperience = useMemo(
    () => fibonacci((saveData?.level ?? 1) + 1) * baseLevelExperience,
    [saveData?.level]
  );

  const currentDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const hoursUntilMidnight = useMemo(() => {
    const midnight = new Date();
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    return Math.ceil(
      (midnight.getTime() - new Date().getTime()) / 1000 / 60 / 60
    );
  }, []);

  useEffect(() => {
    const localSaveData =
      localStorage.getItem("saveData") ??
      JSON.stringify({
        level: 1,
        experience: 0,
        skills: Object.entries(skills).reduce(
          (acc, [key, skill]) => ({
            ...acc,
            [key]: {
              points: 0,
              quests: new Array(skill.quests.length).fill(false),
            },
          }),
          {}
        ),
      });
    if (!localStorage.getItem("saveData")) {
      localStorage.setItem("saveData", localSaveData);
    }
    setSaveData(JSON.parse(localSaveData));
  }, []);

  useEffect(() => {
    if (saveData) {
      localStorage.setItem("saveData", JSON.stringify(saveData));
      if (saveData.complete_date !== currentDate) {
        let newSaveData = { ...saveData } as SaveData;
        Object.keys(skills).forEach((skill) => {
          newSaveData.skills[skill].quests.fill(false);
        });
        newSaveData.complete_date = currentDate;
        setSaveData(newSaveData);
      }
    }
  }, [currentDate, saveData]);

  const handleCompleteQuest = useCallback(
    (index: number, checked: boolean) => {
      let newSaveData = { ...saveData } as SaveData;
      newSaveData.experience += baseGainExperience;
      if (newSaveData.experience >= levelExperience) {
        newSaveData.experience -= levelExperience;
        newSaveData.level += 1;
      }

      newSaveData.skills[selectedQuest].points +=
        skills[selectedQuest].quests[index].points;

      newSaveData.skills[selectedQuest].quests[index] = checked;
      setSaveData(newSaveData);
    },
    [levelExperience, saveData, selectedQuest]
  );

  if (!saveData || saveData.complete_date !== currentDate) return null;

  return (
    <main className="flex justify-center">
      <div className="flex flex-col gap-4 m-4 w-[700px]">
        <Menu>
          <span className="uppercase text-xl">Level. {saveData.level}</span>
          <progress
            value={saveData.experience}
            max={levelExperience}
            className="w-full"
          />
          <div className="flex flex-row justify-end">
            <span>{`${saveData.experience}/${levelExperience}`}</span>
          </div>
        </Menu>
        <Menu title="Skills">
          <div className="grid grid-flow-row grid-cols-3 gap-4">
            {Object.entries(skills).map(([key, { icon }]) => (
              <div
                key={key}
                className={`border-solid rounded-md border-4 p-4 cursor-pointer ${
                  selectedQuest === key
                    ? "border-blue-400 text-blue-400"
                    : "hover:border-blue-200 hover:text-blue-200"
                }`}
                onClick={() => setSelectedQuest(key as keyof typeof skills)}
              >
                <span className="uppercase text-xl">{key}</span>
                <div className="flex flex-row justify-between">
                  {icon}
                  <span className="text-6xl">
                    {saveData.skills[key].points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Menu>
        <Menu title="Quests">
          <div>
            <ul>
              {skills[selectedQuest]?.quests.map((quest, index) => (
                <li key={quest.name}>
                  <div className="flex flex-row gap-2 items-center my-2">
                    <Checkbox
                      defaultChecked={
                        saveData.skills[selectedQuest].quests[index] ?? false
                      }
                      onChange={(e) => {
                        handleCompleteQuest(index, e.target.checked);
                      }}
                    />
                    <span className="text-lg">{quest.name}</span>
                  </div>
                </li>
              ))}
              <div className="flex flex-row gap-2 my-4">
                <AlertCircle size={32} />
                <span className="text-lg">
                  Resets in {hoursUntilMidnight} hours
                </span>
              </div>
            </ul>
          </div>
        </Menu>
      </div>
    </main>
  );
};

export default Home;
