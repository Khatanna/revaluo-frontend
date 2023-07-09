import { Page, View, Document, Image } from "@react-pdf/renderer";

const Sticker = ({ url }: { url: string }) => {
  console.log(url);
  return (
    <Document>
      <Page size={"A4"}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Image
            src={url}
            style={{
              width: "200px",
              padding: "5px 15px",
              height: "110px",
              border: "1px dotted black",
            }}
          />
          <Image
            src={url}
            style={{
              width: "200px",
              padding: "5px 15px",
              height: "110px",
              border: "1px dotted black",
            }}
          />
          <Image
            src={url}
            style={{
              width: "200px",
              padding: "5px 15px",
              height: "110px",
              border: "1px dotted black",
            }}
          />
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Image
            src={url}
            style={{
              width: "200px",
              padding: "5px 15px",
              height: "110px",
              border: "1px dotted black",
            }}
          />
          <Image
            src={url}
            style={{
              width: "200px",
              padding: "5px 15px",
              height: "110px",
              border: "1px dotted black",
            }}
          />
          <Image
            src={url}
            style={{
              width: "200px",
              padding: "5px 15px",
              height: "110px",
              border: "1px dotted black",
            }}
          />
        </View>
      </Page>
    </Document>
  );
};

export default Sticker;
