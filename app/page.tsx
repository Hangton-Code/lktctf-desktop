"use client";

import { Settings, Settings2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Get the current time and format it into "HH:MM:SS"
const getCurrentTime = (): string => {
  const now = new Date();
  const formatTime = (unit: number): string => String(unit).padStart(2, "0");
  return `${formatTime(now.getHours())}:${formatTime(
    now.getMinutes()
  )}:${formatTime(now.getSeconds())}`;
};

export default function Home() {
  const [time, setTime] = useState<string>(getCurrentTime()); // Initialize with the current time
  const [inputTime, setInputTime] = useState<string>(""); // Input to update the time
  const [deviceName, setDeviceName] = useState("PC");
  const { toast } = useToast();

  const sendSecret = () => {
    console.log("sent");
    toast({
      title: "Scheduled: Don't forget your password",
      description: "The password is: mr-yeung-is-handsome",
      duration: 20000,
    });
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === "18:00:00") {
          sendSecret();
        }

        // Split the time string into hours, minutes, and seconds
        let [hours, minutes, seconds] = prevTime.split(":").map(Number);

        // Increment seconds
        seconds += 1;

        // Handle overflow
        if (seconds === 60) {
          seconds = 0;
          minutes += 1;
        }
        if (minutes === 60) {
          minutes = 0;
          hours += 1;
        }
        if (hours === 24) {
          hours = 0;
        }

        // Format the updated time as a string with leading zeros
        const formatTime = (unit: number): string =>
          String(unit).padStart(2, "0");
        return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(
          seconds
        )}`;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timerId);
  }, []);

  // Handle input change
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInputTime(event.target.value);
  };

  // Update the clock time when the input is submitted
  const handleSetTime = (): void => {
    // Validate the input format (HH:MM:SS)
    const isValidTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
      inputTime
    );
    if (isValidTime) {
      setTime(inputTime);
      setInputTime(""); // Clear the input field
    } else {
      alert("Invalid time format. Please use HH:MM:SS.");
    }
  };

  return (
    <>
      <div className="fixed w-full h-full -z-10 pointer-events-none select-none">
        <div className="w-full h-full relative">
          <Image
            src={"/wallpaper.jpg"}
            alt=""
            className="object-cover object-left-top"
            fill
          />
        </div>
      </div>

      <div className="flex justify-between h-full flex-col">
        <div className="w-24 h-24 m-6 flex flex-col items-center cursor-pointer">
          <div className="w-16 h-16 relative">
            <Image fill src="/recycle-bin.png" alt="" />
          </div>
          <p className="text-center text-white shadow-sm">Recycle Bin</p>
        </div>

        <div className="h-12 bg-gray-800 bg-opacity-50 backdrop-blur-md flex justify-between w-full">
          <Dialog>
            <DialogTrigger asChild>
              <div className="w-12 h-12 bg-gray-800 bg-opacity-5 backdrop-blur-md flex justify-center  items-center text-white cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-8 h-8"
                >
                  <path fill="#1976d2" d="M6,6h17v17H6V6z" />
                  <path fill="#1976d2" d="M25.042,22.958V6H42v16.958H25.042z" />
                  <path fill="#1976d2" d="M6,25h17v17H6V25z" />
                  <path fill="#1976d2" d="M25,42V25h17v17H25z" />
                </svg>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader className="border-b border-border pb-4">
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-8">
                <div className="space-y-6">
                  <p className="text-2xl font-semibold underline underline-offset-6">
                    System
                  </p>
                  <div className="space-y-4 pl-4">
                    <div className="flex items-center justify-between">
                      <p>Local Time</p>
                      <div className="flex items-center gap-1">
                        <Input
                          value={inputTime}
                          onChange={handleInputChange}
                          placeholder="Set time (HH:MM:SS)"
                          className="max-w-[160px]"
                        />
                        <Button onClick={handleSetTime}>Set Time</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Device Name</p>
                      <Input
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        className="max-w-[200px]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p>Version</p>
                      <p>12.0.0.1beta</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <div className="w-24 h-12 flex justify-center text-center items-center text-white">
            {time}
          </div>
        </div>
      </div>
    </>
  );
}
