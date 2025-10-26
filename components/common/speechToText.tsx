import React, { useRef, useState, useCallback } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { Button } from "../ui/button";
import { Mic, MicOff } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useBaseStore } from "@/store/baseState/base";
import { LanguageEnum } from "@/constants/enums/base";

interface Props {
  onResult?: (text: string) => void;
  buttonStyle?: any;
  textStyle?: any;
}

const VoiceToTextScreen: React.FC<Props> = ({ onResult, buttonStyle }) => {
  const [listening, setListening] = useState(false);
  const language = useBaseStore((state) => state.language === LanguageEnum.EN ? "en-US" : "fa-IR");
  const webviewRef = useRef<any>(null);


  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <script>
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = '${language}';
          recognition.interimResults = false;

          recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            window.ReactNativeWebView.postMessage(text);
          };

          recognition.onerror = (e) => window.ReactNativeWebView.postMessage('__ERROR__');
          recognition.onend = () => window.ReactNativeWebView.postMessage('__STOPPED__');

          window.startListening = () => recognition.start();
          window.stopListening = () => recognition.stop();
        </script>
      </body>
    </html>
  `;

  const handleMessage = useCallback(
    (event: any) => {
      const result = event.nativeEvent.data;
      if (result && result !== "__STOPPED__" && result !== "__ERROR__") {
        onResult?.(result);
      }
      if (result === "__STOPPED__") setListening(false);
    },
    [onResult]
  );

  const toggleListening = useCallback(() => {
    if (listening) {
      webviewRef.current?.injectJavaScript("window.stopListening();");
      setListening(false);
    } else {
      webviewRef.current?.injectJavaScript("window.startListening();");
      setListening(true);
    }
  }, [listening]);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Button
        onPress={toggleListening}
        style={[buttonStyle, { backgroundColor: listening ? Colors.main.primary : Colors.main.border }]}
      >
        {listening ? <Mic /> : <MicOff />}
      </Button>

      <WebView
        ref={webviewRef}
        source={{ html }}
        onMessage={handleMessage}
        style={{ display: "none" }}
      />
    </View>
  );
};

export default VoiceToTextScreen;
