import pptxgen from "pptxgenjs";

interface PresentationData {
  title: string;
  subtitle: string;
  createdAt: Date;
  logo: string | null;
  pipeline: string | null;
  management: Management[];
  slides: Array<Slide>;
  type:
    | "pitch_deck"
    | "market_research"
    | "marketing_plan"
    | "company_overview";
}

interface Management {
  id: string;
  url: string;
  presentationId: string;
}

interface Slide {
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  bulletPoints: {
    value: string;
  }[];
  graph: {
    title: string;
    source: string;
    valueIn: string;
    type: "bar" | "table" | "pie" | "line";
    dataPoints: {
      name: string;
      value: number;
    }[];
  } | null;
}

interface Theme {
  title: string;
  subtitle: string;
  text: string;
  background: string;
  graphFirst: string;
  graphSecond: string;
  graphThird: string;
  graphForth: string;
  graphFifth: string;
  graphSixth: string;
  logo: string;
}

interface Base64 {
  logo?: string;
  pipeline?: string;
  management?: (string | undefined)[];
}

async function getMeta(url: string) {
  const img = new Image();
  img.src = url;
  await img.decode();
  return img.naturalWidth / img.naturalHeight;
}

export async function generatePptx({
  data,
  theme,
  base64,
}: {
  data?: PresentationData;
  theme: Theme;
  base64?: Base64;
}) {
  if (!data || !base64) {
    return;
  }
  const hasBucketLogo = !!data.logo;
  const logoUrl = hasBucketLogo
    ? `${process.env.NEXT_PUBLIC_BUCKET_URL as string}/${data.logo as string}`
    : `${process.env.NEXT_PUBLIC_BASE_URL as string}/logo/${theme.logo}`;

  let logoWidthToHeight = 1;

  try {
    logoWidthToHeight = await getMeta(logoUrl);
  } catch (err) {
    console.log(err);
  }

  const pptx = new pptxgen();
  createCoverSlide({
    data,
    pptx,
    theme,
    logoWidthToHeight,
    hasBucketLogo,
    base64,
  });

  createForwardStatmentSlide(pptx, theme);

  await Promise.all(
    data.slides.map(async (slide) => {
      await createRegularSlide({
        slide,
        pptx,
        theme,
        hasBucketLogo,
        logoWidthToHeight,
        data,
        base64,
      });
    })
  );

  createDisclaimerSlide(pptx, theme);

  await pptx.writeFile({ fileName: `${data.title}.pptx` });
}

function createCoverSlide({
  data,
  pptx,
  theme,
  logoWidthToHeight,
  hasBucketLogo,
  base64,
}: {
  data: PresentationData;
  pptx: pptxgen;
  theme: Theme;
  logoWidthToHeight: number;
  hasBucketLogo: boolean;
  base64: Base64;
}) {
  const cover = pptx.addSlide();
  cover.background = { color: theme.background };

  const title = insertLineBreaks(data.title, 45);
  const subtitle = insertLineBreaks(data.subtitle, 100);
  const formattedDate = data.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  cover.addText(title.text, {
    x: 0.5,
    y: 1.6,
    w: "95%",
    h: 1,
    fontSize: 32,
    bold: true,
    align: "left",
    color: theme.title,
    valign: "top",
  });

  cover.addText(subtitle.text, {
    x: 0.5,
    y: 1.6 + title.lines * 0.55,
    w: "95%",
    h: 1,
    fontSize: 14,
    align: "left",
    color: theme.subtitle,
    valign: "top",
  });

  cover.addText(formattedDate, {
    x: 0.5,
    y: 1.6 + 0.3 + subtitle.lines * 0.25 + title.lines * 0.55,
    w: "95%",
    h: 1,
    fontSize: 13,
    align: "left",
    color: theme.subtitle,
    valign: "top",
  });

  if (!hasBucketLogo) {
    cover.addImage({
      path: `${process.env.NEXT_PUBLIC_BASE_URL as string}/logo/${theme.logo}`,
      x: 0.5,
      y: 4.6,
      w: 2,
      h: 0.53,
    });
  }

  if (hasBucketLogo && data.logo && base64.logo) {
    cover.addImage({
      data: base64.logo,
      x: 0.5,
      y: 1.6 + 0.3 + subtitle.lines * 0.25 + title.lines * 0.55 + 0.4,
      w:
        Math.min(
          5 - (1.6 + 0.3 + subtitle.lines * 0.25 + title.lines * 0.55 + 0.4),
          1.4
        ) * logoWidthToHeight,
      h: Math.min(
        5 - (1.6 + 0.3 + subtitle.lines * 0.25 + title.lines * 0.55 + 0.4),
        1.4
      ),
    });
  }
}

async function createRegularSlide({
  slide,
  pptx,
  theme,
  logoWidthToHeight,
  hasBucketLogo,
  data,
  base64,
}: {
  slide: Slide;
  pptx: pptxgen;
  theme: Theme;
  logoWidthToHeight: number;
  hasBucketLogo: boolean;
  data: PresentationData;
  base64: Base64;
}) {
  const newSlide = pptx.addSlide();

  newSlide.background = { color: theme.background };

  newSlide.addText(slide.title.toUpperCase(), {
    x: 0.5,
    y: 0.3,
    w: "95%",
    h: 1,
    fontSize: 10,
    bold: true,
    align: "left",
    color: theme.title,
    valign: "top",
  });

  const subtitle = insertLineBreaks(slide.subtitle, 75);

  newSlide.addText(subtitle.text, {
    x: 0.5,
    y: 0.45,
    w: "95%",
    h: 1,
    fontSize: 20,
    bold: true,
    align: "left",
    color: theme.subtitle,
    valign: "top",
  });

  const summary = insertLineBreaks(slide.summary, 100);

  newSlide.addText(summary.text, {
    x: 0.5,
    y: 0.45 + subtitle.lines * 0.4,
    w: "95%",
    h: 1,
    fontSize: 14,
    align: "left",
    color: theme.text,
    valign: "top",
  });

  newSlide.addText(String(slide.number), {
    x: 0.5,
    y: 5.2,
    w: "93%",
    h: 1,
    fontSize: 10,
    align: "right",
    color: theme.graphFirst,
    valign: "top",
  });

  if (!hasBucketLogo) {
    newSlide.addImage({
      path: `${process.env.NEXT_PUBLIC_BASE_URL as string}/logo/${theme.logo}`,
      x: 8.5,
      y: 5.19,
      w: 1,
      h: 0.26,
    });
  }

  if (hasBucketLogo && data.logo) {
    newSlide.addImage({
      data: base64.logo,
      x: 9.5 - 0.29 * logoWidthToHeight,
      y: 5.19,
      w: 0.29 * logoWidthToHeight,
      h: 0.29,
    });
  }

  let totalBulletPointLines = 0;

  const isManagementSlideWithImages =
    data.type === "company_overview" &&
    slide.number === 7 &&
    data.management.length > 0 &&
    !!base64.management;

  async function processBulletPoints() {
    for (const [index, point] of slide.bulletPoints.entries()) {
      const bulletPoint = insertLineBreaks(point.value, 60);
      const yOffset =
        0.45 + subtitle.lines * 0.4 + summary.lines * 0.25 + index * 0.7 + 0.2;

      newSlide.addText(bulletPoint.text, {
        x: 2.5,
        y: yOffset,
        w: "90%",
        h: 1,
        fontSize: 14,
        align: "left",
        color: theme.text,
        valign: "top",
      });

      const managementData = data.management?.[index];
      const managementBase64 = base64.management?.[index];

      if (managementData && managementBase64) {
        const managementUrl = `${
          process.env.NEXT_PUBLIC_BUCKET_URL as string
        }/${managementData.url}`;

        try {
          const logoWidthToHeight = await getMeta(managementUrl);
          newSlide.addImage({
            data: managementBase64,
            x: 1.8,
            y: yOffset,
            w: 0.6 * logoWidthToHeight,
            h: 0.6,
          });
        } catch (err) {
          console.error(`Error processing image for ${managementUrl}`);
        }
      }
    }
  }

  if (isManagementSlideWithImages) {
    await processBulletPoints();
  }

  const isContactSlide = slide.number === 8 && data.type === "company_overview";

  if (!isManagementSlideWithImages && !isContactSlide) {
    slide.bulletPoints.forEach((point) => {
      const bulletPoint = insertLineBreaks(point.value, 95);
      const bulletPointArray = bulletPoint.text.split("\n");
      bulletPointArray.forEach((text, index) => {
        newSlide.addText(text, {
          x: index === 0 ? 0.8 : 1.2,
          bullet: index === 0 ? true : false,
          y:
            0.45 +
            subtitle.lines * 0.4 +
            summary.lines * 0.25 +
            totalBulletPointLines * 0.25 +
            0.25 * index,
          w: "90%",
          h: 1,
          fontSize: 14,
          align: "left",
          color: theme.text,
          valign: "top",
        });
      });
      totalBulletPointLines += bulletPoint.lines;
    });
  }

  const yStart =
    0.9 + summary.lines * 0.25 + totalBulletPointLines * 0.25 + 0.25;

  createGraph({ newSlide, theme, slide, pptx, yStart });

  if (
    data.type === "company_overview" &&
    slide.number === 6 &&
    !!data.pipeline &&
    !!base64.pipeline
  ) {
    const pipelineURL = `${process.env.NEXT_PUBLIC_BUCKET_URL as string}/${
      data.pipeline
    }`;

    let logoWidthToHeight = 1;

    try {
      logoWidthToHeight = await getMeta(pipelineURL);
    } catch (err) {
      console.log(err);
    }

    newSlide.addImage({
      data: base64.pipeline,
      x: 5 - 1.2 * logoWidthToHeight,
      y: yStart,
      w: 2.4 * logoWidthToHeight,
      h: 2.4,
    });
  }
}

type createGraphProps = {
  newSlide: pptxgen.Slide;
  theme: Theme;
  slide: Slide;
  pptx: pptxgen;
  yStart: number;
};

function createGraph({
  newSlide,
  theme,
  slide,
  pptx,
  yStart,
}: createGraphProps) {
  if (!slide.graph) return;

  yStart = Math.max(yStart, 2.5);

  newSlide.addText(`${slide.graph.title} (${slide.graph.valueIn})`, {
    x: 0.5,
    y: yStart,
    w: "90%",
    h: 1,
    fontSize: 12,
    bold: true,
    align: "center",
    color: theme.subtitle,
    valign: "top",
  });

  const dataChartAreaLine = [
    {
      name: slide.graph.title,
      labels: slide.graph.dataPoints.map((data) => data.name),
      values: slide.graph.dataPoints.map((data) => data.value),
    },
  ];

  if (slide.graph.type === "bar") {
    newSlide.addChart(pptx.ChartType.bar, dataChartAreaLine, {
      x: 0.5,
      y: yStart + 0.4,
      w: "90%",
      h: 1.7,
      chartColors: [theme.graphFirst],
      valAxisHidden: true,
      valGridLine: { style: "none" },
      dataLabelColor: theme.text,
      dataLabelFontSize: 10,
      catAxisLabelFontSize: 10,
      dataLabelPosition: "outEnd",
      dataLabelFormatCode: "#.0",
      showValue: true,
    });
  }

  if (slide.graph.type === "pie") {
    newSlide.addChart(pptx.ChartType.pie, dataChartAreaLine, {
      x: 3,
      y: yStart + 0.4,
      w: "40%",
      h: 1.7,
      chartColors: [
        theme.graphFirst,
        theme.graphSecond,
        theme.graphThird,
        theme.graphForth,
        theme.graphFifth,
        theme.graphSixth,
      ],
      valAxisHidden: true,
      valGridLine: { style: "none" },
      dataLabelColor: theme.text,
      legendPos: "r",
      showLegend: true,
      dataLabelFontSize: 10,
      catAxisLabelFontSize: 10,
      dataLabelPosition: "outEnd",
      dataLabelFormatCode: "#.0",
      showValue: true,
    });
  }

  if (slide.graph.type === "line") {
    newSlide.addChart(pptx.ChartType.line, dataChartAreaLine, {
      x: 0.5,
      y: yStart + 0.4,
      w: "90%",
      h: 1.7,
      chartColors: [theme.graphFirst],
      valAxisHidden: true,
      valGridLine: { style: "none" },
      dataLabelColor: theme.text,
      dataLabelFontSize: 10,
      catAxisLabelFontSize: 10,
      dataLabelPosition: "t",
      dataLabelFormatCode: "#.0",
      showValue: true,
    });
  }

  if (slide.graph.type === "table") {
    newSlide.addChart(pptx.ChartType.bar, dataChartAreaLine, {
      x: 0.5,
      y: yStart + 0.4,
      w: "90%",
      h: 1.7,
      chartColors: [theme.graphFirst],
      valAxisHidden: true,
      valGridLine: { style: "none" },
      dataLabelColor: theme.text,
      dataLabelFontSize: 10,
      catAxisLabelFontSize: 10,
      dataLabelPosition: "outEnd",
      dataLabelFormatCode: "#.0",
      showValue: true,
    });
  }

  newSlide.addText(slide.graph.source, {
    x: 0.5,
    y: yStart + 2.1,
    w: "95%",
    h: 1,
    fontSize: 10,
    align: "center",
    color: theme.text,
    valign: "top",
  });
}

function createDisclaimerSlide(pptx: pptxgen, theme: Theme) {
  const disclaimerText = `
Please read this disclaimer carefully before using Taqdimly.ai, our AI-powered PowerPoint presentation app. By using our app, you are agreeing to be bound by the terms of this disclaimer. If you do not agree to these terms, do not use our app.

Our AI-powered PowerPoint presentation app uses advanced machine learning algorithms and natural language processing techniques to create presentations automatically. However, there is no guarantee that the content generated by our app is accurate, as it may contain errors or inaccuracies. We cannot guarantee the accuracy or reliability of the content generated by our app, and we are not liable for any damages or losses resulting from its use. The content generated by our app is intended for informational purposes only, and it should not be relied upon as a substitute for expert advice. Our app is not intended to replace human intelligence and expertise, but rather to assist users in creating presentations quickly and efficiently.

Users of our app should review the content generated by our app before using it in any official capacity. Our app is not a substitute for professional or expert advice, and users should consult with appropriate professionals if they have any questions or concerns about the content generated by our app. We would like to emphasize that our app creates content based on the data it has been trained on, and it may not take into account all possible scenarios or viewpoints. Therefore, the content generated by our app may be biased or incomplete. Our app is not intended to provide legal, medical, financial, or any other type of advice, and users should seek the advice of appropriate professionals in those areas. Users of our app are responsible for ensuring that the content generated by our app is legal, ethical, and appropriate for their purposes.

We are not responsible for any legal or ethical issues that may arise from the use of our app. Users of our app are responsible for ensuring that the content generated by our app complies with all applicable laws, regulations, and ethical standards. In no event shall we be liable for any direct, indirect, special, incidental, or consequential damages arising out of or in connection with the use or inability to use our app or the content generated by our app. This includes, but is not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses.

Our app is provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, as to the operation of our app or the information, content, materials, or products included on our app. To the fullest extent permissible by applicable law, we disclaim all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose. We reserve the right to modify or discontinue our app at any time without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuance of our app. We strongly advise users to review the content generated by the app before using it in any official capacity, and we are not liable for any consequences resulting from such use.`;

  const newSlide = pptx.addSlide();

  newSlide.background = { color: theme.background };
  newSlide.addText("DISCLAIMER", {
    x: 0.5,
    y: 0.3,
    w: "95%",
    h: 1,
    fontSize: 10,
    bold: true,
    align: "left",
    color: theme.title,
    valign: "top",
  });

  newSlide.addText(disclaimerText, {
    x: 0.5,
    y: 0.45,
    w: "95%",
    h: 1,
    fontSize: 9,
    align: "left",
    color: theme.text,
    valign: "top",
  });
}

function createForwardStatmentSlide(pptx: pptxgen, theme: Theme) {
  const disclaimerText = `
This document contains forward-looking statements within the meaning of the Private Securities Litigation Reform Act of 1995. Forward-looking statements are generally written in the future tense and/or are preceded by words such as ''may,'' ''will,'' ''should,'' ''forecast,'' ''could,'' ''expect,'' ''suggest,'' ''believe,'' ''estimate,'' ''continue,'' ''anticipate,'' ''intend,'' ''plan,'' or similar words, or the negatives of such terms or other variations on such terms or comparable terminology. These statements are based on current expectations, estimates, forecasts, and projections about the industry in which we operate and the beliefs and assumptions of our management. They are not guarantees of future performance and involve certain risks, uncertainties, and assumptions that are difficult to predict. Therefore, actual outcomes and results may differ materially from what is expressed or forecasted in such forward-looking statements. Factors that could cause or contribute to such differences include, but are not limited to, economic conditions, competition, the impact of governmental regulations, and other risks detailed from time to time in our filings with the Securities and Exchange Commission. We undertake no obligation to update publicly any forward-looking statements, whether as a result of new information, future events, or otherwise. Investors are encouraged to review the latest information on our company available on the SEC's website or our own company's website for updated information.`;

  const newSlide = pptx.addSlide();

  newSlide.background = { color: theme.background };
  newSlide.addText("FORWARD-LOOKING STATEMENT", {
    x: 0.5,
    y: 0.3,
    w: "95%",
    h: 1,
    fontSize: 10,
    bold: true,
    align: "left",
    color: theme.title,
    valign: "top",
  });

  newSlide.addText(disclaimerText, {
    x: 0.5,
    y: 0.45,
    w: "90%",
    h: 1,
    fontSize: 14,
    align: "left",
    color: theme.text,
    valign: "top",
  });
}

function insertLineBreaks(str: string, numChars: number) {
  if (str.length <= numChars) {
    return { text: str, lines: 1 };
  }

  let lastSpaceIndex = -1;
  let lines = 1;

  for (let i = 1; i < str.length; i++) {
    if (str[i] === " ") {
      lastSpaceIndex = i;
    }

    if (i % numChars === 0) {
      str =
        str.slice(0, lastSpaceIndex + 1) + "\n" + str.slice(lastSpaceIndex + 1);
      lines += 1;
    }
  }
  return { text: str, lines };
}
