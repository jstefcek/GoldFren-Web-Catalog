import { ResponsivePie } from '@nivo/pie';

export function Custom_ResponsivePie({ Data = [] }) {
  return (
    <ResponsivePie
      data={Data}
      margin={{ top: 0, right: 85, bottom: 0, left: 85 }}
      innerRadius={0.4}
      padAngle={0.8}
      cornerRadius={5}
      colors={{ scheme: "set1" }}
      activeOuterRadiusOffset={8}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
      legends={[]}
    />
  );
}
