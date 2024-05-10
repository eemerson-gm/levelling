"use client";

import { Checkbox } from "@/components/checkbox";
import { Menu } from "@/components/menu";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Coffee, Wind, Zap } from "react-feather";

const skillSize = "64";
const baseLevelExperience = 100;
const baseGainExperience = 10;

const skills = {
  strength: {
    icon: <Zap size={skillSize} />,
    quests: ["30 pushups", "50 bicep curls", "30 squats"],
  },
  agility: {
    icon: <Wind size={skillSize} />,
    quests: ["1km run"],
  },
  cooking: {
    icon: <Coffee size={skillSize} />,
    quests: ["Learn a new recipe"],
  },
};

interface SaveData {
  level: number;
  experience: number;
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
    }
  }, [saveData]);

  const handleCompleteQuest = useCallback(
    (index: number, checked: boolean) => {
      let newSaveData = { ...saveData } as SaveData;
      newSaveData.experience += baseGainExperience;
      if (newSaveData.experience >= levelExperience) {
        newSaveData.experience -= levelExperience;
        newSaveData.level += 1;
      }
      newSaveData.skills[selectedQuest].points += 1;
      newSaveData.skills[selectedQuest].quests[index] = checked;
      setSaveData(newSaveData);
    },
    [levelExperience, saveData, selectedQuest]
  );

  if (!saveData) return null;

  return (
    <main className="flex justify-center">
      <div className="flex flex-col gap-4 m-4">
        <Menu>
          <span className="uppercase text-xl">Level. 1</span>
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
        <Menu title="Quest">
          <div>
            <ul>
              {skills[selectedQuest]?.quests.map((quest, index) => (
                <li key={quest}>
                  <div className="flex flex-row gap-2 items-center my-2">
                    <Checkbox
                      defaultChecked={
                        saveData.skills[selectedQuest].quests[index] ?? false
                      }
                      onChange={(e) =>
                        handleCompleteQuest(index, e.target.checked)
                      }
                    />
                    <span className="text-lg">{quest}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Menu>
      </div>
    </main>
  );
};

export { Home };
