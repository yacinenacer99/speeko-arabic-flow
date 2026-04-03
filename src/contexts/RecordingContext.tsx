import { createContext, useContext, useState, type ReactNode } from "react";

interface RecordingContextType {
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
}

const RecordingContext = createContext<RecordingContextType>({
  isRecording: false,
  setIsRecording: () => {},
});

export const RecordingProvider = ({ children }: { children: ReactNode }) => {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <RecordingContext.Provider value={{ isRecording, setIsRecording }}>
      {children}
    </RecordingContext.Provider>
  );
};

export const useRecordingContext = () => useContext(RecordingContext);
