import React, { useEffect, useRef } from "react";
import { Platform, View } from "react-native";
import WebView from "react-native-webview";

const htmlContent = `
<!doctype html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
  html, body {
    margin: 0;
    padding: 0;
  }
  #icon {
    background-size: cover;
    border-radius: 50%;
  }
  </style>
  <script>
    !function(){function e(e){for(var o=0;o<c.length;o++)c[o]=0;for(var o=0;o<e.length;o++)c[o%4]=(c[o%4]<<5)-c[o%4]+e.charCodeAt(o)}function o(){var e=c[0]^c[0]<<11;return c[0]=c[1],c[1]=c[2],c[2]=c[3],c[3]=c[3]^c[3]>>19^e^e>>8,(c[3]>>>0)/(1<<31>>>0)}function r(){var e=Math.floor(360*o()),r=60*o()+40+"%",t=25*(o()+o()+o()+o())+"%",l="hsl("+e+","+r+","+t+")";return l}function t(e){for(var r=e,t=e,l=Math.ceil(r/2),n=r-l,a=[],c=0;t>c;c++){for(var i=[],f=0;l>f;f++)i[f]=Math.floor(2.3*o());var s=i.slice(0,n);s.reverse(),i=i.concat(s);for(var h=0;h<i.length;h++)a.push(i[h])}return a}function l(o){var t={};return t.seed=o.seed||Math.floor(Math.random()*Math.pow(10,16)).toString(16),e(t.seed),t.size=o.size||8,t.scale=o.scale||4,t.color=o.color||r(),t.bgcolor=o.bgcolor||r(),t.spotcolor=o.spotcolor||r(),t}function n(e,o){var r=t(e.size),l=Math.sqrt(r.length);o.width=o.height=e.size*e.scale;var n=o.getContext("2d");n.fillStyle=e.bgcolor,n.fillRect(0,0,o.width,o.height),n.fillStyle=e.color;for(var a=0;a<r.length;a++)if(r[a]){var c=Math.floor(a/l),i=a%l;n.fillStyle=1==r[a]?e.color:e.spotcolor,n.fillRect(i*e.scale,c*e.scale,e.scale,e.scale)}return o}function a(e){var e=l(e||{}),o=document.createElement("canvas");return n(e,o),o}var c=new Array(4),i={create:a,render:n};"undefined"!=typeof module&&(module.exports=i),"undefined"!=typeof window&&(window.blockies=i)}();
  </script>
  <script> 
    function generate(address, width, height, border) {
      var icon = document.getElementById('icon');
      icon.style.width = '' + width + 'px'
      icon.style.height = '' + height + 'px'
      icon.style.background = 'url(' + blockies.create({ seed:address, width: 8, height: 8, scale: 8 }).toDataURL()+')'
    }
  </script>
</head>
<body>
  <div id="icon"></div>
</body>
`;

type Props = {
  containerStyle?: object;
  style?: object;
  width: number;
  height: number;
  blockies: string;
};
const Blockies = (props: Props) => {
  const webviewRef = useRef(null);

  useEffect(() => {
    console.log("GENERATE");
    webviewRef.current.injectJavaScript(
      `generate('${props.blockies}', ${props.width}, ${props.height});`
    );
  }, [props.blockies, props.width, props.height]);

  return (
    <View style={props.containerStyle}>
      <WebView
        ref={webviewRef}
        automaticallyAdjustContentInsets={false}
        scalesPageToFit={Platform.OS === "android"}
        contentInset={{ top: 0, right: 0, bottom: 0, left: 0 }}
        source={{ html: htmlContent }}
        opaque={false}
        underlayColor={"transparent"}
        javaScriptEnabled={true}
        scrollEnabled={true}
        injectedJavaScript={`generate('${props.blockies}', ${props.width}, ${props.height})`}
        style={props.style}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn(
            "WebView received error status code: ",
            nativeEvent.statusCode
          );
        }}
      />
    </View>
  );
};

export default Blockies;
