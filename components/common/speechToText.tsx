import React, { useRef, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { WebView } from 'react-native-webview';

export default function VoiceToTextScreen() {
  const [text, setText] = useState('');
  console.log(text)
  const webviewRef = useRef<any>(null);

  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <script>
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = 'en-US';
          recognition.interimResults = false;
          recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            window.ReactNativeWebView.postMessage(text);
          };
          recognition.start();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title="Start Listening"
        onPress={() => webviewRef.current.injectJavaScript('recognition.start();')}
      />
      <Text style={{ marginTop: 20, fontSize: 18 }}>Result: {text}</Text>

      <WebView
        ref={webviewRef}
        source={{ html }}
        onMessage={(event) => setText(event.nativeEvent.data)}
        style={{ display: 'none' }}
      />
    </View>
  );
}
