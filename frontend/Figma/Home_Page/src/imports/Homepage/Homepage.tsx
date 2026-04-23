import svgPaths from "./svg-5h7j3kzknk";
import imgHomePageImage from "./f8c3ef8a3714caedee33afd06854e0f9ed0f03bf.png";
import imgAb6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM from "./1f8d1d7a1cab9fb61c1abc8ad8834d7995559fe3.png";
import imgAb6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm from "./a80e34f885fb2a2d966e9133d5d180bb40d1b733.png";
import imgAb6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El from "./70200e3d7162fff411eeddedd461a2c4086b24fd.png";
import imgAb6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI from "./f5d4642b627c8264bbd7fcbecc8199143a0fe621.png";

function HomePageImage() {
  return (
    <div className="h-[923px] overflow-clip relative rounded-bl-[70px] rounded-br-[70px] shrink-0 w-full" data-name="Home Page Image">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-bl-[70px] rounded-br-[70px] size-full" src={imgHomePageImage} />
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 923">
        <g id="Vector">
          <path d="M0 40H1440V923H0V40Z" fill="url(#paint0_linear_2_631)" />
          <path d="M0 0H1440V923H0V0Z" fill="url(#paint1_radial_2_631)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2_631" x1="720" x2="720" y1="923" y2="40">
            <stop stopColor="#25005A" />
            <stop offset="1" stopColor="#25005A" stopOpacity="0" />
          </linearGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(720 461.5) scale(864.294 834.241)" gradientUnits="userSpaceOnUse" id="paint1_radial_2_631" r="1">
            <stop offset="0.2" stopOpacity="0" />
            <stop offset="1" stopOpacity="0.4" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[30px] tracking-[-0.75px] whitespace-nowrap">
        <p className="leading-[36px]">Popular Right Now</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 size-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 9.33333">
        <g id="Container">
          <path d={svgPaths.pce77c00} fill="var(--fill-0, #630ED4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[62.53px]">
        <p className="leading-[24px]">View All</p>
      </div>
      <Container1 />
    </div>
  );
}

function Container() {
  return (
    <div className="col-1 content-stretch flex h-[36px] items-center justify-between ml-0 mt-0 px-[30px] relative row-1 w-full" data-name="Container">
      <Heading />
      <Button />
    </div>
  );
}

function Ab6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuBdU3SPL3WkOTdBSjP2-xm1GxwF_FMzCmQHD3yfAHcvH70pRNWXmHOjF46mGgDAlxSVzyYjpeUYznoRPjEozP-Mj1UtuLR6-mAa2mvmJ76cxMA6rz0bMDNt0EwnpmB8STuoMqT2G7TILea18Pbzkjy48hQb7Mq7ECcS0ikAAosgZhpYMua_GlqIIG31nJ9NrWXy2ngqRQKbbp4vLE8pg5KNdR2Ds_OVjr2YKe6zhOlqHbe05pAetwyQtXMJ5Ntk30DvVe29kP7KHS_M">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM} />
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="absolute bg-[#93000a] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[83.78px]">
        <p className="leading-[15px]">Eco Friendly</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM />
      <Background />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.97px]">
        <p className="leading-[16px]">4.9</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container7 />
      <Margin1 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[168.75px]">
        <p className="leading-[28px]">Carrara Statuario</p>
      </div>
      <Container6 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container5 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Paragraph">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[18px] whitespace-nowrap">
        <p className="leading-[28px]">{`Rs.2000.00 `}</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[72.84px]">
          <p className="leading-[15px]">Polished Finish</p>
        </div>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[71.97px]">
          <p className="leading-[15px]">Stain Resistant</p>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background1 />
      <Background2 />
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container8 />
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative shrink-0 w-[298px] z-[1]" data-name="Container">
      <Margin />
      <Margin2 />
      <Margin3 />
      <Button1 />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 1">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Ab6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuChgFGb9FBXzDxtleV94kjUh36HCbzM0fcJsasGElZWz33NTkKkKzw4vf43PZNVIWwLIHU_UZhTXFrFcJRWtR-CfgDhFJoW04WebTxZVe_4sfGei-pEPciA8wNmgH1mk23pHIej2tGH2y4dLn6ls71lw3Yh-1U51bplXfbZlIQ6JEZOuBFgIPAQiz6I6rjQrkMUEgmpn-0SZmLemWn8H07dZHzQN6EuvoAJpaDLSYJwfewEpa5vWOKDE9ID7DWdQtxWcBYTu24MzuFm">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm} />
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="absolute bg-[#630ed4] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[75.66px]">
        <p className="leading-[15px]">Best Seller</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm />
      <Background3 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[11.083px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.78px]">
        <p className="leading-[16px]">4.8</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container13 />
      <Margin5 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[143.2px]">
        <p className="leading-[28px]">Onyx Slate Tile</p>
      </div>
      <Container12 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container11 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-0 not-italic text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.5000.00</p>
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph1 />
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[48.48px]">
          <p className="leading-[15px]">Fire Rated</p>
        </div>
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[69.8px]">
          <p className="leading-[15px]">Weather Proof</p>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background4 />
      <Background5 />
    </div>
  );
}

function Margin7() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container14 />
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin4 />
        <Margin6 />
        <Margin7 />
        <Button2 />
      </div>
    </div>
  );
}

function ReuseOtherCardsWithSlightlyDifferentImagesDataForVisualVariety() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Reuse other cards with slightly different images/data for visual variety">
      <Container9 />
      <Container10 />
    </div>
  );
}

function Ab6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuDMUMN6Bd1B96GclOY9NoNGhh0kdNeaFKuxVNx_bocNSm8h-IW7ZEdK842gzRJUOOLsEcp1-1coAksq8cUVoz9dSfDSwtdNeKMS0SfIs0M4w4HVHWwZqw_hS28EHTejo-NUWtct2uRpi0BD8Uh2irDPI4dsUvTRvxhC1kNkYnAdiseSNctCkYVReagqbWgAXWdup2VBQ4qbf9hY-kAJVX2Y-T1cLzjkjj-ose_SOrc7b1SwaZCoXaoRqX5QBMhNGCBA3wkDjdKmU4El">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El} />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El />
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin9() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.47px]">
        <p className="leading-[16px]">5.0</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container19 />
      <Margin9 />
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[143.95px]">
          <p className="leading-[28px]">Artisan Walnut</p>
        </div>
        <Container18 />
      </div>
    </div>
  );
}

function Margin8() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container17 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.4000.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center left-[110px] text-[#7b7487] text-[12px] top-[14.33px] w-[32.8px]">
        <p className="leading-[16px]">/ sq.ft</p>
      </div>
    </div>
  );
}

function Margin10() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph2 />
    </div>
  );
}

function Background6() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[57.64px]">
          <p className="leading-[15px]">Real Timber</p>
        </div>
      </div>
    </div>
  );
}

function Background7() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[64.2px]">
          <p className="leading-[15px]">UV Protected</p>
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background6 />
      <Background7 />
    </div>
  );
}

function Margin11() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container20 />
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin8 />
        <Margin10 />
        <Margin11 />
        <Button3 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 3">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Ab6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuAnDIMoBA_GpobLroY6O1TUo6u4k9YUXEcEbRQly0hHt60-YvpsPugjUFQBqadAszWFCQFG41zL0KJ-4raq4_x3btPyatxiA2QSdwFidd-DRXQ--tzYYa8uk-3fPM6stx0bLliKmqpNSn6RbgFtMfIZFeY7xnjHDbzYeI8odQqWzdm4Wt_Y1GR4asiFgm_Aqu7t-cBjQ-IcCCGngzZJ6GVxbTHkPuHk8xROpARPL8zxswED-U2BG-kHhg69dqHfuaJpPRG_BiNv5-xI">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI} />
      </div>
    </div>
  );
}

function Background8() {
  return (
    <div className="absolute bg-[#93000a] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[83.78px]">
        <p className="leading-[15px]">Eco Friendly</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI />
      <Background8 />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin13() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.08px]">
        <p className="leading-[16px]">4.7</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container25 />
      <Margin13 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[139.28px]">
        <p className="leading-[28px]">Crystal Clarity</p>
      </div>
      <Container24 />
    </div>
  );
}

function Margin12() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container23 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.1500.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center left-[104px] text-[#7b7487] text-[12px] top-[14.33px] w-[38.91px]">
        <p className="leading-[16px]">/ panel</p>
      </div>
    </div>
  );
}

function Margin14() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph3 />
    </div>
  );
}

function Background9() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[71.91px]">
          <p className="leading-[15px]">Low Emissivity</p>
        </div>
      </div>
    </div>
  );
}

function Background10() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[63.94px]">
          <p className="leading-[15px]">Shatter Proof</p>
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background9 />
      <Background10 />
    </div>
  );
}

function Margin15() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container26 />
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin12 />
        <Margin14 />
        <Margin15 />
        <Button4 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 4">
      <Container21 />
      <Container22 />
    </div>
  );
}

function Container2() {
  return (
    <div className="col-1 content-stretch flex gap-[40px] h-[481px] items-start ml-0 mt-[76px] px-[40px] relative row-1 w-full" data-name="Container">
      <Card />
      <ReuseOtherCardsWithSlightlyDifferentImagesDataForVisualVariety />
      <Card2 />
      <Card3 />
    </div>
  );
}

function PopularProductsSection() {
  return (
    <div className="grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full" data-name="Popular Products Section">
      <Container />
      <Container2 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[30px] tracking-[-0.75px] whitespace-nowrap">
        <p className="leading-[36px]">Budget Friendly Picks</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 size-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 9.33333">
        <g id="Container">
          <path d={svgPaths.pce77c00} fill="var(--fill-0, #630ED4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[62.53px]">
        <p className="leading-[24px]">View All</p>
      </div>
      <Container28 />
    </div>
  );
}

function Container27() {
  return (
    <div className="col-1 content-stretch flex h-[36px] items-center justify-between ml-0 mt-0 px-[30px] relative row-1 w-full" data-name="Container">
      <Heading1 />
      <Button5 />
    </div>
  );
}

function Ab6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM1() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuBdU3SPL3WkOTdBSjP2-xm1GxwF_FMzCmQHD3yfAHcvH70pRNWXmHOjF46mGgDAlxSVzyYjpeUYznoRPjEozP-Mj1UtuLR6-mAa2mvmJ76cxMA6rz0bMDNt0EwnpmB8STuoMqT2G7TILea18Pbzkjy48hQb7Mq7ECcS0ikAAosgZhpYMua_GlqIIG31nJ9NrWXy2ngqRQKbbp4vLE8pg5KNdR2Ds_OVjr2YKe6zhOlqHbe05pAetwyQtXMJ5Ntk30DvVe29kP7KHS_M">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM} />
      </div>
    </div>
  );
}

function Background11() {
  return (
    <div className="absolute bg-[#93000a] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[83.78px]">
        <p className="leading-[15px]">Eco Friendly</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM1 />
      <Background11 />
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin17() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.97px]">
        <p className="leading-[16px]">4.9</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container34 />
      <Margin17 />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[168.75px]">
        <p className="leading-[28px]">Carrara Statuario</p>
      </div>
      <Container33 />
    </div>
  );
}

function Margin16() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container32 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-0 not-italic text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.1000.00</p>
      </div>
    </div>
  );
}

function Margin18() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph4 />
    </div>
  );
}

function Background12() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[72.84px]">
          <p className="leading-[15px]">Polished Finish</p>
        </div>
      </div>
    </div>
  );
}

function Background13() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[71.97px]">
          <p className="leading-[15px]">Stain Resistant</p>
        </div>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background12 />
      <Background13 />
    </div>
  );
}

function Margin19() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container35 />
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative shrink-0 w-[298px] z-[1]" data-name="Container">
      <Margin16 />
      <Margin18 />
      <Margin19 />
      <Button6 />
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 1">
      <Container30 />
      <Container31 />
    </div>
  );
}

function Ab6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm1() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuChgFGb9FBXzDxtleV94kjUh36HCbzM0fcJsasGElZWz33NTkKkKzw4vf43PZNVIWwLIHU_UZhTXFrFcJRWtR-CfgDhFJoW04WebTxZVe_4sfGei-pEPciA8wNmgH1mk23pHIej2tGH2y4dLn6ls71lw3Yh-1U51bplXfbZlIQ6JEZOuBFgIPAQiz6I6rjQrkMUEgmpn-0SZmLemWn8H07dZHzQN6EuvoAJpaDLSYJwfewEpa5vWOKDE9ID7DWdQtxWcBYTu24MzuFm">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm} />
      </div>
    </div>
  );
}

function Background14() {
  return (
    <div className="absolute bg-[#630ed4] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[75.66px]">
        <p className="leading-[15px]">Best Seller</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm1 />
      <Background14 />
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[11.083px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin21() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.78px]">
        <p className="leading-[16px]">4.8</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container40 />
      <Margin21 />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[143.2px]">
        <p className="leading-[28px]">Onyx Slate Tile</p>
      </div>
      <Container39 />
    </div>
  );
}

function Margin20() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container38 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.1500.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center left-[103px] text-[#7b7487] text-[12px] top-[14px] w-[28.72px]">
        <p className="leading-[16px]">/ unit</p>
      </div>
    </div>
  );
}

function Margin22() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph5 />
    </div>
  );
}

function Background15() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[48.48px]">
          <p className="leading-[15px]">Fire Rated</p>
        </div>
      </div>
    </div>
  );
}

function Background16() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[69.8px]">
          <p className="leading-[15px]">Weather Proof</p>
        </div>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background15 />
      <Background16 />
    </div>
  );
}

function Margin23() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container41 />
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin20 />
        <Margin22 />
        <Margin23 />
        <Button7 />
      </div>
    </div>
  );
}

function ReuseOtherCardsWithSlightlyDifferentImagesDataForVisualVariety1() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Reuse other cards with slightly different images/data for visual variety">
      <Container36 />
      <Container37 />
    </div>
  );
}

function Ab6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El1() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuDMUMN6Bd1B96GclOY9NoNGhh0kdNeaFKuxVNx_bocNSm8h-IW7ZEdK842gzRJUOOLsEcp1-1coAksq8cUVoz9dSfDSwtdNeKMS0SfIs0M4w4HVHWwZqw_hS28EHTejo-NUWtct2uRpi0BD8Uh2irDPI4dsUvTRvxhC1kNkYnAdiseSNctCkYVReagqbWgAXWdup2VBQ4qbf9hY-kAJVX2Y-T1cLzjkjj-ose_SOrc7b1SwaZCoXaoRqX5QBMhNGCBA3wkDjdKmU4El">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El} />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El1 />
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin25() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.47px]">
        <p className="leading-[16px]">5.0</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container46 />
      <Margin25 />
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[143.95px]">
          <p className="leading-[28px]">Artisan Walnut</p>
        </div>
        <Container45 />
      </div>
    </div>
  );
}

function Margin24() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container44 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.1100.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center left-[100px] text-[#7b7487] text-[12px] top-[14px] w-[32.8px]">
        <p className="leading-[16px]">/ sq.ft</p>
      </div>
    </div>
  );
}

function Margin26() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph6 />
    </div>
  );
}

function Background17() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[57.64px]">
          <p className="leading-[15px]">Real Timber</p>
        </div>
      </div>
    </div>
  );
}

function Background18() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[64.2px]">
          <p className="leading-[15px]">UV Protected</p>
        </div>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background17 />
      <Background18 />
    </div>
  );
}

function Margin27() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container47 />
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin24 />
        <Margin26 />
        <Margin27 />
        <Button8 />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 3">
      <Container42 />
      <Container43 />
    </div>
  );
}

function Ab6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI1() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuAnDIMoBA_GpobLroY6O1TUo6u4k9YUXEcEbRQly0hHt60-YvpsPugjUFQBqadAszWFCQFG41zL0KJ-4raq4_x3btPyatxiA2QSdwFidd-DRXQ--tzYYa8uk-3fPM6stx0bLliKmqpNSn6RbgFtMfIZFeY7xnjHDbzYeI8odQqWzdm4Wt_Y1GR4asiFgm_Aqu7t-cBjQ-IcCCGngzZJ6GVxbTHkPuHk8xROpARPL8zxswED-U2BG-kHhg69dqHfuaJpPRG_BiNv5-xI">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI} />
      </div>
    </div>
  );
}

function Background19() {
  return (
    <div className="absolute bg-[#93000a] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[83.78px]">
        <p className="leading-[15px]">Eco Friendly</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI1 />
      <Background19 />
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin29() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.08px]">
        <p className="leading-[16px]">4.7</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container52 />
      <Margin29 />
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[139.28px]">
        <p className="leading-[28px]">Crystal Clarity</p>
      </div>
      <Container51 />
    </div>
  );
}

function Margin28() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container50 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.500.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center left-[103px] text-[#7b7487] text-[12px] top-[14px] w-[38.91px]">
        <p className="leading-[16px]">/ panel</p>
      </div>
    </div>
  );
}

function Margin30() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph7 />
    </div>
  );
}

function Background20() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[71.91px]">
          <p className="leading-[15px]">Low Emissivity</p>
        </div>
      </div>
    </div>
  );
}

function Background21() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[63.94px]">
          <p className="leading-[15px]">Shatter Proof</p>
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background20 />
      <Background21 />
    </div>
  );
}

function Margin31() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container53 />
    </div>
  );
}

function Button9() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin28 />
        <Margin30 />
        <Margin31 />
        <Button9 />
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 4">
      <Container48 />
      <Container49 />
    </div>
  );
}

function Container29() {
  return (
    <div className="col-1 content-stretch flex gap-[40px] h-[481px] items-start ml-0 mt-[76px] px-[40px] relative row-1 w-full" data-name="Container">
      <Card1 />
      <ReuseOtherCardsWithSlightlyDifferentImagesDataForVisualVariety1 />
      <Card4 />
      <Card5 />
    </div>
  );
}

function PopularProductsSection1() {
  return (
    <div className="grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full" data-name="Popular Products Section">
      <Container27 />
      <Container29 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[30px] tracking-[-0.75px] whitespace-nowrap">
        <p className="leading-[36px]">Top Rated Materials</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 size-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 9.33333">
        <g id="Container">
          <path d={svgPaths.pce77c00} fill="var(--fill-0, #630ED4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[62.53px]">
        <p className="leading-[24px]">View All</p>
      </div>
      <Container55 />
    </div>
  );
}

function Container54() {
  return (
    <div className="col-1 content-stretch flex h-[36px] items-center justify-between ml-0 mt-0 px-[30px] relative row-1 w-full" data-name="Container">
      <Heading2 />
      <Button10 />
    </div>
  );
}

function Ab6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM2() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuBdU3SPL3WkOTdBSjP2-xm1GxwF_FMzCmQHD3yfAHcvH70pRNWXmHOjF46mGgDAlxSVzyYjpeUYznoRPjEozP-Mj1UtuLR6-mAa2mvmJ76cxMA6rz0bMDNt0EwnpmB8STuoMqT2G7TILea18Pbzkjy48hQb7Mq7ECcS0ikAAosgZhpYMua_GlqIIG31nJ9NrWXy2ngqRQKbbp4vLE8pg5KNdR2Ds_OVjr2YKe6zhOlqHbe05pAetwyQtXMJ5Ntk30DvVe29kP7KHS_M">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM} />
      </div>
    </div>
  );
}

function Background22() {
  return (
    <div className="absolute bg-[#93000a] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[83.78px]">
        <p className="leading-[15px]">Eco Friendly</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM2 />
      <Background22 />
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin33() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.97px]">
        <p className="leading-[16px]">4.9</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container61 />
      <Margin33 />
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[168.75px]">
        <p className="leading-[28px]">Carrara Statuario</p>
      </div>
      <Container60 />
    </div>
  );
}

function Margin32() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container59 />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.10000.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center left-[118px] text-[#7b7487] text-[12px] top-[13.67px] w-[32.8px]">
        <p className="leading-[16px]">/ sq.ft</p>
      </div>
    </div>
  );
}

function Margin34() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph8 />
    </div>
  );
}

function Background23() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[72.84px]">
          <p className="leading-[15px]">Polished Finish</p>
        </div>
      </div>
    </div>
  );
}

function Background24() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[71.97px]">
          <p className="leading-[15px]">Stain Resistant</p>
        </div>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background23 />
      <Background24 />
    </div>
  );
}

function Margin35() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container62 />
    </div>
  );
}

function Button11() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative shrink-0 w-[298px] z-[1]" data-name="Container">
      <Margin32 />
      <Margin34 />
      <Margin35 />
      <Button11 />
    </div>
  );
}

function Card6() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 1">
      <Container57 />
      <Container58 />
    </div>
  );
}

function Ab6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm2() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuChgFGb9FBXzDxtleV94kjUh36HCbzM0fcJsasGElZWz33NTkKkKzw4vf43PZNVIWwLIHU_UZhTXFrFcJRWtR-CfgDhFJoW04WebTxZVe_4sfGei-pEPciA8wNmgH1mk23pHIej2tGH2y4dLn6ls71lw3Yh-1U51bplXfbZlIQ6JEZOuBFgIPAQiz6I6rjQrkMUEgmpn-0SZmLemWn8H07dZHzQN6EuvoAJpaDLSYJwfewEpa5vWOKDE9ID7DWdQtxWcBYTu24MzuFm">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm} />
      </div>
    </div>
  );
}

function Background25() {
  return (
    <div className="absolute bg-[#630ed4] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[75.66px]">
        <p className="leading-[15px]">Best Seller</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm2 />
      <Background25 />
    </div>
  );
}

function Container67() {
  return (
    <div className="h-[11.083px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin37() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.78px]">
        <p className="leading-[16px]">4.8</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container67 />
      <Margin37 />
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[143.2px]">
        <p className="leading-[28px]">Onyx Slate Tile</p>
      </div>
      <Container66 />
    </div>
  );
}

function Margin36() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container65 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="content-stretch flex gap-[10px] items-center leading-[0] not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Paragraph">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#630ed4] text-[18px]">
        <p className="leading-[28px]">Rs.7000.00</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#7b7487] text-[12px]">
        <p className="leading-[16px]">/ unit</p>
      </div>
    </div>
  );
}

function Margin38() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph9 />
    </div>
  );
}

function Background26() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[48.48px]">
          <p className="leading-[15px]">Fire Rated</p>
        </div>
      </div>
    </div>
  );
}

function Background27() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[69.8px]">
          <p className="leading-[15px]">Weather Proof</p>
        </div>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background26 />
      <Background27 />
    </div>
  );
}

function Margin39() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container68 />
    </div>
  );
}

function Button12() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin36 />
        <Margin38 />
        <Margin39 />
        <Button12 />
      </div>
    </div>
  );
}

function ReuseOtherCardsWithSlightlyDifferentImagesDataForVisualVariety2() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Reuse other cards with slightly different images/data for visual variety">
      <Container63 />
      <Container64 />
    </div>
  );
}

function Ab6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El2() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuDMUMN6Bd1B96GclOY9NoNGhh0kdNeaFKuxVNx_bocNSm8h-IW7ZEdK842gzRJUOOLsEcp1-1coAksq8cUVoz9dSfDSwtdNeKMS0SfIs0M4w4HVHWwZqw_hS28EHTejo-NUWtct2uRpi0BD8Uh2irDPI4dsUvTRvxhC1kNkYnAdiseSNctCkYVReagqbWgAXWdup2VBQ4qbf9hY-kAJVX2Y-T1cLzjkjj-ose_SOrc7b1SwaZCoXaoRqX5QBMhNGCBA3wkDjdKmU4El">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El} />
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El2 />
    </div>
  );
}

function Container73() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin41() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.47px]">
        <p className="leading-[16px]">5.0</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container73 />
      <Margin41 />
    </div>
  );
}

function Container71() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[143.95px]">
          <p className="leading-[28px]">Artisan Walnut</p>
        </div>
        <Container72 />
      </div>
    </div>
  );
}

function Margin40() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container71 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.5000.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center left-[106px] text-[#7b7487] text-[12px] top-[13.67px] w-[32.8px]">
        <p className="leading-[16px]">/ sq.ft</p>
      </div>
    </div>
  );
}

function Margin42() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph10 />
    </div>
  );
}

function Background28() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[57.64px]">
          <p className="leading-[15px]">Real Timber</p>
        </div>
      </div>
    </div>
  );
}

function Background29() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[64.2px]">
          <p className="leading-[15px]">UV Protected</p>
        </div>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background28 />
      <Background29 />
    </div>
  );
}

function Margin43() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container74 />
    </div>
  );
}

function Button13() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin40 />
        <Margin42 />
        <Margin43 />
        <Button13 />
      </div>
    </div>
  );
}

function Card7() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 3">
      <Container69 />
      <Container70 />
    </div>
  );
}

function Ab6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI2() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuAnDIMoBA_GpobLroY6O1TUo6u4k9YUXEcEbRQly0hHt60-YvpsPugjUFQBqadAszWFCQFG41zL0KJ-4raq4_x3btPyatxiA2QSdwFidd-DRXQ--tzYYa8uk-3fPM6stx0bLliKmqpNSn6RbgFtMfIZFeY7xnjHDbzYeI8odQqWzdm4Wt_Y1GR4asiFgm_Aqu7t-cBjQ-IcCCGngzZJ6GVxbTHkPuHk8xROpARPL8zxswED-U2BG-kHhg69dqHfuaJpPRG_BiNv5-xI">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI} />
      </div>
    </div>
  );
}

function Background30() {
  return (
    <div className="absolute bg-[#93000a] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[83.78px]">
        <p className="leading-[15px]">Eco Friendly</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI2 />
      <Background30 />
    </div>
  );
}

function Container79() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin45() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.08px]">
        <p className="leading-[16px]">4.7</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container79 />
      <Margin45 />
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[139.28px]">
        <p className="leading-[28px]">Crystal Clarity</p>
      </div>
      <Container78 />
    </div>
  );
}

function Margin44() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container77 />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.3000.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center left-[108px] text-[#7b7487] text-[12px] top-[13.67px] w-[38.91px]">
        <p className="leading-[16px]">/ panel</p>
      </div>
    </div>
  );
}

function Margin46() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph11 />
    </div>
  );
}

function Background31() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[71.91px]">
          <p className="leading-[15px]">Low Emissivity</p>
        </div>
      </div>
    </div>
  );
}

function Background32() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[63.94px]">
          <p className="leading-[15px]">Shatter Proof</p>
        </div>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background31 />
      <Background32 />
    </div>
  );
}

function Margin47() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container80 />
    </div>
  );
}

function Button14() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin44 />
        <Margin46 />
        <Margin47 />
        <Button14 />
      </div>
    </div>
  );
}

function Card8() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 4">
      <Container75 />
      <Container76 />
    </div>
  );
}

function Container56() {
  return (
    <div className="col-1 content-stretch flex gap-[40px] h-[481px] items-start ml-0 mt-[76px] px-[40px] relative row-1 w-full" data-name="Container">
      <Card6 />
      <ReuseOtherCardsWithSlightlyDifferentImagesDataForVisualVariety2 />
      <Card7 />
      <Card8 />
    </div>
  );
}

function PopularProductsSection2() {
  return (
    <div className="grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full" data-name="Popular Products Section">
      <Container54 />
      <Container56 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[30px] tracking-[-0.75px] whitespace-nowrap">
        <p className="leading-[36px]">Best for Your Climate</p>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="relative shrink-0 size-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 9.33333">
        <g id="Container">
          <path d={svgPaths.pce77c00} fill="var(--fill-0, #630ED4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[62.53px]">
        <p className="leading-[24px]">View All</p>
      </div>
      <Container82 />
    </div>
  );
}

function Container81() {
  return (
    <div className="col-1 content-stretch flex h-[36px] items-center justify-between ml-0 mt-0 px-[30px] relative row-1 w-full" data-name="Container">
      <Heading3 />
      <Button15 />
    </div>
  );
}

function Ab6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM3() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuBdU3SPL3WkOTdBSjP2-xm1GxwF_FMzCmQHD3yfAHcvH70pRNWXmHOjF46mGgDAlxSVzyYjpeUYznoRPjEozP-Mj1UtuLR6-mAa2mvmJ76cxMA6rz0bMDNt0EwnpmB8STuoMqT2G7TILea18Pbzkjy48hQb7Mq7ECcS0ikAAosgZhpYMua_GlqIIG31nJ9NrWXy2ngqRQKbbp4vLE8pg5KNdR2Ds_OVjr2YKe6zhOlqHbe05pAetwyQtXMJ5Ntk30DvVe29kP7KHS_M">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM} />
      </div>
    </div>
  );
}

function Background33() {
  return (
    <div className="absolute bg-[#93000a] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[83.78px]">
        <p className="leading-[15px]">Eco Friendly</p>
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuBdU3Spl3WkOTdBSjP2Xm1GxwFFMzCmQhd3YfAHcvH70PRnwXmHOjF46MGgDAlxSVzyYjpeUYznoRPjEozPMj1UtuLr6MAa2MvmJ76CxMa6Rz0BMdNt0EwnpmB8STuoMqT2G7TiLea18Pbzkjy48HQb7Mq7ECcS0IkAAosgZhpYMuaGlqIig31NJ9NrWXy2NgqRqKbbp4VLe8Pg5KNdR2DsOVjr2YKe6ZhOlqHbe05PAetwyQtXmj5Ntk30DvVe29KP7KhsM3 />
      <Background33 />
    </div>
  );
}

function Container88() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin49() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.97px]">
        <p className="leading-[16px]">4.9</p>
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container88 />
      <Margin49 />
    </div>
  );
}

function Container86() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[168.75px]">
        <p className="leading-[28px]">Carrara Statuario</p>
      </div>
      <Container87 />
    </div>
  );
}

function Margin48() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container86 />
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.2500.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center left-[110px] text-[#7b7487] text-[12px] top-[14.33px] w-[32.8px]">
        <p className="leading-[16px]">/ sq.ft</p>
      </div>
    </div>
  );
}

function Margin50() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph12 />
    </div>
  );
}

function Background34() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[72.84px]">
          <p className="leading-[15px]">Polished Finish</p>
        </div>
      </div>
    </div>
  );
}

function Background35() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[71.97px]">
          <p className="leading-[15px]">Stain Resistant</p>
        </div>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background34 />
      <Background35 />
    </div>
  );
}

function Margin51() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container89 />
    </div>
  );
}

function Button16() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative shrink-0 w-[298px] z-[1]" data-name="Container">
      <Margin48 />
      <Margin50 />
      <Margin51 />
      <Button16 />
    </div>
  );
}

function Card9() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 1">
      <Container84 />
      <Container85 />
    </div>
  );
}

function Ab6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm3() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuChgFGb9FBXzDxtleV94kjUh36HCbzM0fcJsasGElZWz33NTkKkKzw4vf43PZNVIWwLIHU_UZhTXFrFcJRWtR-CfgDhFJoW04WebTxZVe_4sfGei-pEPciA8wNmgH1mk23pHIej2tGH2y4dLn6ls71lw3Yh-1U51bplXfbZlIQ6JEZOuBFgIPAQiz6I6rjQrkMUEgmpn-0SZmLemWn8H07dZHzQN6EuvoAJpaDLSYJwfewEpa5vWOKDE9ID7DWdQtxWcBYTu24MzuFm">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm} />
      </div>
    </div>
  );
}

function Background36() {
  return (
    <div className="absolute bg-[#630ed4] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[75.66px]">
        <p className="leading-[15px]">Best Seller</p>
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuChgFGb9FbXzDxtleV94KjUh36HCbzM0FcJsasGElZWz33NTkKkKzw4Vf43PznviWwLihuUZhTxFrFcJrWtRCfgDhFJoW04WebTxZVe4SfGeiPEPciA8WNmgH1Mk23PHIej2TGh2Y4DLn6Ls71Lw3Yh1U51BplXfbZlIq6JezOuBFgIpaQiz6I6RjQrkMuEgmpn0SZmLemWn8H07DZHzQn6EuvoAJpaDlsyJwfewEpa5VWokde9Id7DWdQtxWcByTu24MzuFm3 />
      <Background36 />
    </div>
  );
}

function Container94() {
  return (
    <div className="h-[11.083px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin53() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.78px]">
        <p className="leading-[16px]">4.8</p>
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container94 />
      <Margin53 />
    </div>
  );
}

function Container92() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[143.2px]">
        <p className="leading-[28px]">Onyx Slate Tile</p>
      </div>
      <Container93 />
    </div>
  );
}

function Margin52() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container92 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px]">
        <p className="leading-[28px]">Rs.3000.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center left-[111px] text-[#7b7487] text-[12px] top-[13.33px]">
        <p className="leading-[16px]">/ unit</p>
      </div>
    </div>
  );
}

function Margin54() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph13 />
    </div>
  );
}

function Background37() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[48.48px]">
          <p className="leading-[15px]">Fire Rated</p>
        </div>
      </div>
    </div>
  );
}

function Background38() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[69.8px]">
          <p className="leading-[15px]">Weather Proof</p>
        </div>
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background37 />
      <Background38 />
    </div>
  );
}

function Margin55() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container95 />
    </div>
  );
}

function Button17() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin52 />
        <Margin54 />
        <Margin55 />
        <Button17 />
      </div>
    </div>
  );
}

function ReuseOtherCardsWithSlightlyDifferentImagesDataForVisualVariety3() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Reuse other cards with slightly different images/data for visual variety">
      <Container90 />
      <Container91 />
    </div>
  );
}

function Ab6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El3() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuDMUMN6Bd1B96GclOY9NoNGhh0kdNeaFKuxVNx_bocNSm8h-IW7ZEdK842gzRJUOOLsEcp1-1coAksq8cUVoz9dSfDSwtdNeKMS0SfIs0M4w4HVHWwZqw_hS28EHTejo-NUWtct2uRpi0BD8Uh2irDPI4dsUvTRvxhC1kNkYnAdiseSNctCkYVReagqbWgAXWdup2VBQ4qbf9hY-kAJVX2Y-T1cLzjkjj-ose_SOrc7b1SwaZCoXaoRqX5QBMhNGCBA3wkDjdKmU4El">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El} />
      </div>
    </div>
  );
}

function Container96() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuDmumn6Bd1B96GclOy9NoNGhh0KdNeaFKuxVNxBocNSm8HIw7ZEdK842GzRjuooLsEcp11CoAksq8CUVoz9DSfDSwtdNeKms0SfIs0M4W4HvhWwZqwHS28EhTejoNuWtct2URpi0Bd8Uh2IrDpi4DsUvTRvxhC1KNkYnAdiseSNctCkYvReagqbWgAxWdup2Vbq4Qbf9HYKAjvx2YT1CLzjkjjOseSOrc7B1SwaZCoXaoRqX5QbMhNgcba3WkDjdKmU4El3 />
    </div>
  );
}

function Container100() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin57() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.47px]">
        <p className="leading-[16px]">5.0</p>
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container100 />
      <Margin57 />
    </div>
  );
}

function Container98() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative size-full">
        <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[143.95px]">
          <p className="leading-[28px]">Artisan Walnut</p>
        </div>
        <Container99 />
      </div>
    </div>
  );
}

function Margin56() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container98 />
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px]">
        <p className="leading-[28px]">Rs.1500.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center left-[105px] text-[#7b7487] text-[12px] top-[13.33px]">
        <p className="leading-[16px]">/ sq.ft</p>
      </div>
    </div>
  );
}

function Margin58() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph14 />
    </div>
  );
}

function Background39() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[57.64px]">
          <p className="leading-[15px]">Real Timber</p>
        </div>
      </div>
    </div>
  );
}

function Background40() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[64.2px]">
          <p className="leading-[15px]">UV Protected</p>
        </div>
      </div>
    </div>
  );
}

function Container101() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background39 />
      <Background40 />
    </div>
  );
}

function Margin59() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container101 />
    </div>
  );
}

function Button18() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin56 />
        <Margin58 />
        <Margin59 />
        <Button18 />
      </div>
    </div>
  );
}

function Card10() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 3">
      <Container96 />
      <Container97 />
    </div>
  );
}

function Ab6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI3() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="AB6AXuAnDIMoBA_GpobLroY6O1TUo6u4k9YUXEcEbRQly0hHt60-YvpsPugjUFQBqadAszWFCQFG41zL0KJ-4raq4_x3btPyatxiA2QSdwFidd-DRXQ--tzYYa8uk-3fPM6stx0bLliKmqpNSn6RbgFtMfIZFeY7xnjHDbzYeI8odQqWzdm4Wt_Y1GR4asiFgm_Aqu7t-cBjQ-IcCCGngzZJ6GVxbTHkPuHk8xROpARPL8zxswED-U2BG-kHhg69dqHfuaJpPRG_BiNv5-xI">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[109.37%] left-0 max-w-none top-[-4.69%] w-full" src={imgAb6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI} />
      </div>
    </div>
  );
}

function Background41() {
  return (
    <div className="absolute bg-[#93000a] content-stretch flex flex-col items-start left-[16px] px-[12px] py-[4px] rounded-[9999px] top-[16px]" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[1px] uppercase w-[83.78px]">
        <p className="leading-[15px]">Eco Friendly</p>
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="content-stretch flex flex-col h-[256px] items-start justify-center overflow-clip relative shrink-0 w-[345px] z-[2]" data-name="Container">
      <Ab6AXuAnDiMoBaGpobLroY6O1TUo6U4K9YuxEcEbRQly0HHt60YvpsPugjUfqBqadAszWfcqfg41ZL0Kj4Raq4X3BtPyatxiA2QSdwFiddDrxqTzYYa8Uk3FPm6Stx0BLliKmqpNSn6RbgFtMfIzFeY7XnjHDbzYeI8OdQqWzdm4WtY1Gr4AsiFgmAqu7TCBjQIcCcGngzZj6GVxbTHkPuHk8XROpArpl8ZxswEdU2BgKHhg69DqHfuaJpPrgBiNv5XI3 />
      <Background41 />
    </div>
  );
}

function Container106() {
  return (
    <div className="h-[11.083px] mr-[-0.01px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.0833">
        <g id="Container">
          <path d={svgPaths.p21398000} fill="var(--fill-0, #6F46B9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin61() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[4px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6f46b9] text-[12px] w-[18.08px]">
        <p className="leading-[16px]">4.7</p>
      </div>
    </div>
  );
}

function Container105() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <Container106 />
      <Margin61 />
    </div>
  );
}

function Container104() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[#1a1b23] text-[20px] w-[139.28px]">
        <p className="leading-[28px]">Crystal Clarity</p>
      </div>
      <Container105 />
    </div>
  );
}

function Margin60() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container104 />
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[28px] leading-[0] not-italic relative shrink-0 w-full" data-name="Paragraph">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center left-0 text-[#630ed4] text-[18px] top-[13.5px] whitespace-nowrap">
        <p className="leading-[28px]">Rs.800.00</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center left-[105px] text-[#7b7487] text-[12px] top-[14.33px] w-[38.91px]">
        <p className="leading-[16px]">/ panel</p>
      </div>
    </div>
  );
}

function Margin62() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Paragraph15 />
    </div>
  );
}

function Background42() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[71.91px]">
          <p className="leading-[15px]">Low Emissivity</p>
        </div>
      </div>
    </div>
  );
}

function Background43() {
  return (
    <div className="bg-[#e9e7f3] relative rounded-[16px] self-stretch shrink-0" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[10px] w-[63.94px]">
          <p className="leading-[15px]">Shatter Proof</p>
        </div>
      </div>
    </div>
  );
}

function Container107() {
  return (
    <div className="content-stretch flex gap-[8px] h-[23px] items-start relative shrink-0 w-full" data-name="Container">
      <Background42 />
      <Background43 />
    </div>
  );
}

function Margin63() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container107 />
    </div>
  );
}

function Button19() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-px py-[13px] relative rounded-[32px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#ccc3d8] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[16px] text-center w-[95.61px]">
        <p className="leading-[24px]">View Details</p>
      </div>
    </div>
  );
}

function Container103() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between px-[15px] py-[24px] relative size-full">
        <Margin60 />
        <Margin62 />
        <Margin63 />
        <Button19 />
      </div>
    </div>
  );
}

function Card11() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[481px] isolate items-center justify-center overflow-clip relative rounded-[48px] shrink-0 w-[300px]" data-name="Card 4">
      <Container102 />
      <Container103 />
    </div>
  );
}

function Container83() {
  return (
    <div className="col-1 content-stretch flex gap-[40px] h-[481px] items-start ml-0 mt-[76px] px-[40px] relative row-1 w-full" data-name="Container">
      <Card9 />
      <ReuseOtherCardsWithSlightlyDifferentImagesDataForVisualVariety3 />
      <Card10 />
      <Card11 />
    </div>
  );
}

function PopularProductsSection3() {
  return (
    <div className="grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full" data-name="Popular Products Section">
      <Container81 />
      <Container83 />
    </div>
  );
}

function Container109() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[320px] pr-[11.73px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[40px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] w-[308.27px]">
        <p className="leading-[20px] mb-0">{`Precision in Luxury. Curating the world's finest`}</p>
        <p className="leading-[20px]">architectural materials for visionary builders.</p>
      </div>
    </div>
  );
}

function Margin64() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic opacity-90 relative shrink-0 text-[#64748b] text-[14px] w-[329.94px]">
        <p className="leading-[20px]">© 2026 L+ SIVILIMA. Precision in Luxury.</p>
      </div>
    </div>
  );
}

function Container108() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#4c1d95] text-[18px] w-[183.2px]">
          <p className="leading-[28px]">L+ SIVILIMA</p>
        </div>
        <Container109 />
        <Margin64 />
      </div>
    </div>
  );
}

function Container112() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[#6d28d9] text-[12px] tracking-[1.2px] uppercase w-[69.39px]">
        <p className="leading-[16px]">Discover</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] w-[60.56px]">
        <p className="leading-[20px]">Materials</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] w-[88.16px]">
        <p className="leading-[20px]">Sustainability</p>
      </div>
    </div>
  );
}

function Container111() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative self-stretch shrink-0 w-[88.16px]" data-name="Container">
      <Container112 />
      <Link />
      <Link1 />
    </div>
  );
}

function Container114() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[#6d28d9] text-[12px] tracking-[1.2px] uppercase w-[67.59px]">
        <p className="leading-[16px]">Company</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] w-[81.52px]">
        <p className="leading-[20px]">Our Process</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] w-[51.98px]">
        <p className="leading-[20px]">Contact</p>
      </div>
    </div>
  );
}

function Container113() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative self-stretch shrink-0 w-[81.52px]" data-name="Container">
      <Container114 />
      <Link2 />
      <Link3 />
    </div>
  );
}

function Container116() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] relative shrink-0 text-[#6d28d9] text-[12px] tracking-[1.2px] uppercase w-[42.06px]">
        <p className="leading-[16px]">Legal</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[14px] w-[49px]">
        <p className="leading-[20px]">Privacy</p>
      </div>
    </div>
  );
}

function Container115() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative self-stretch shrink-0 w-[49px]" data-name="Container">
      <Container116 />
      <Link4 />
    </div>
  );
}

function Container110() {
  return (
    <div className="h-[80px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[48px] items-start justify-center relative size-full">
        <Container111 />
        <Container113 />
        <Container115 />
      </div>
    </div>
  );
}

function Container117() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[108.774px] items-start justify-center leading-[0] relative w-full" data-name="Container">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#cda8ff] text-[20px] tracking-[1.4px] uppercase whitespace-nowrap">
        <p className="leading-[20px]">Built on Quality Choices</p>
      </div>
      <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold justify-center min-w-full not-italic relative shrink-0 text-[#bcc3ff] text-[100px] tracking-[-3.6px] w-[min-content]">
        <p className="leading-[80px]">L+ SIVILIMA</p>
      </div>
    </div>
  );
}

function Shadow() {
  return (
    <div className="content-stretch flex h-[79px] items-center max-h-[100px] min-h-[32px] relative shadow-[0px_4px_3px_0px_rgba(0,0,0,0.1),0px_10px_8px_0px_rgba(0,0,0,0.04)] shrink-0 w-full" data-name="Shadow">
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-w-px not-italic relative text-[#d2bbff] text-[30px]">
        <p className="leading-[32px]">Source premium materials for your next masterpiece</p>
      </div>
    </div>
  );
}

function Container118() {
  return (
    <div className="content-stretch flex gap-[12px] items-center px-[20px] relative shrink-0 w-[409px]" data-name="Container">
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, white)" id="Icon" />
        </svg>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-full justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-[rgba(255,255,255,0.7)] w-[435.66px]">
        <p className="leading-[normal]">Search materials (tiles, roofing, ceiling...)</p>
      </div>
    </div>
  );
}

function OverlayOverlayBlur() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(255,255,255,0.1)] flex-[1_0_0] min-w-[590px] relative rounded-[9999px]" data-name="Overlay+OverlayBlur">
      <div className="flex flex-row items-center min-w-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between min-w-[inherit] p-[8px] relative size-full">
          <Container118 />
          <div className="bg-[#630ed4] content-stretch flex flex-col items-center justify-center px-[40px] py-[17px] relative rounded-[48px] shrink-0 w-[131px]" data-name="Head Button Primary">
            <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0.31px_0_0] rounded-[48px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]" data-name="Button:shadow" />
            <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white whitespace-nowrap">
              <p className="leading-[28px]">Search</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container119() {
  return (
    <div className="content-stretch flex gap-[42px] h-[62px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#630ed4] content-stretch flex flex-col items-center justify-center px-[40px] py-[17px] relative rounded-[48px] shrink-0" data-name="Head Button Primary">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0.31px_0_0] rounded-[48px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]" data-name="Button:shadow" />
        <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white whitespace-nowrap">
          <p className="leading-[28px]">Browse Materials</p>
        </div>
      </div>
      <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col items-center justify-center px-[41px] py-[17px] relative rounded-[48px] shrink-0" data-name="Head Button Secondary">
        <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.4)] border-solid inset-0 pointer-events-none rounded-[48px]" />
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[48px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
        <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white w-[199.69px]">
          <p className="leading-[28px]">Get Recommendations</p>
        </div>
      </div>
    </div>
  );
}

function HomePageName() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[40px] inset-[5.63%_23.84%_79.18%_23.08%] items-start py-[87px]" data-name="Home Page Name">
      <div className="flex h-[110.376px] items-center justify-center relative shrink-0 w-full" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "42" } as React.CSSProperties}>
        <div className="flex-none rotate-[0.12deg] w-full">
          <Container117 />
        </div>
      </div>
      <Shadow />
      <div className="bg-[rgba(255,255,255,0)] content-stretch flex h-[72px] items-center justify-center relative rounded-[9999px] shadow-[0px_0px_0px_0px_rgba(255,255,255,0.3),0px_25px_50px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
        <OverlayOverlayBlur />
      </div>
      <Container119 />
    </div>
  );
}

function ContentWrapper() {
  return (
    <div className="absolute content-stretch flex flex-col h-[3692px] items-start justify-between left-0 right-0 top-0" data-name="Content Wrapper">
      <HomePageImage />
      <div className="bg-[#fbf8ff] h-[116px] relative rounded-bl-[20px] rounded-br-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full" data-name="Category Tabs">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-between flex flex-wrap gap-x-[25px] items-start px-[30px] py-[10px] relative size-full">
            <div className="bg-[#630ed4] content-stretch flex flex-col items-center justify-center px-[30px] py-[10px] relative rounded-[40px] shrink-0 w-[78px]" data-name="Primary Button">
              <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-full">
                <p className="leading-[20px]">All</p>
              </div>
            </div>
            <div className="bg-[#e3e1ed] content-stretch flex flex-col items-center justify-center px-[30px] py-[10px] relative rounded-[40px] shrink-0 w-[172px]" data-name="Secondary Button">
              <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b23] text-[14px] text-center w-full">
                <p className="leading-[20px]">Roofing Solution</p>
              </div>
            </div>
            <div className="bg-[#e3e1ed] content-stretch flex flex-col items-center justify-center px-[30px] py-[10px] relative rounded-[40px] shrink-0 w-[175px]" data-name="Secondary Button">
              <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b23] text-[14px] text-center w-full">
                <p className="leading-[20px]">Flooring Solution</p>
              </div>
            </div>
            <div className="bg-[#e3e1ed] content-stretch flex flex-col items-center justify-center px-[30px] py-[10px] relative rounded-[40px] shrink-0 w-[167px]">
              <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b23] text-[14px] text-center w-full">
                <p className="leading-[20px]">Ceiling Solution</p>
              </div>
            </div>
            <div className="bg-[#e3e1ed] content-stretch flex flex-col items-center justify-center px-[30px] py-[10px] relative rounded-[40px] shrink-0 w-[148px]" data-name="Secondary Button">
              <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b23] text-[14px] text-center w-full">
                <p className="leading-[20px]">Wall Solution</p>
              </div>
            </div>
            <div className="bg-[#e3e1ed] content-stretch flex flex-col items-center justify-center px-[30px] py-[10px] relative rounded-[40px] shrink-0 w-[144px]" data-name="Secondary Button">
              <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1b23] text-[14px] text-center w-full">
                <p className="leading-[20px]">Accessories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopularProductsSection />
      <PopularProductsSection1 />
      <PopularProductsSection2 />
      <PopularProductsSection3 />
      <div className="bg-[#f8fafc] h-[243px] relative shrink-0 w-full" data-name="Footer">
        <div aria-hidden="true" className="absolute border-[rgba(204,195,216,0.1)] border-solid border-t inset-0 pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between pb-[64px] pt-[65px] px-[48px] relative size-full">
            <Container108 />
            <Container110 />
          </div>
        </div>
      </div>
      <HomePageName />
    </div>
  );
}

function Recommendations() {
  return <div className="h-[20px] shrink-0 w-[138px]" data-name="Recommendations" />;
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[37px] items-center min-w-px relative">
      <div className="content-stretch flex items-center justify-center px-[16px] relative shrink-0 w-[65px]" data-name="Page Name Secondary">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[16px] tracking-[-0.35px] whitespace-nowrap">
          <p className="leading-[20px]">Catalog</p>
        </div>
      </div>
      <div className="content-stretch flex items-center justify-center px-[16px] relative shrink-0 w-[188px]" data-name="Page Name Secondary">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[18px] tracking-[-0.35px] whitespace-nowrap">
          <p className="leading-[20px]">Recommendations</p>
        </div>
      </div>
      <Recommendations />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[75px] items-center min-w-[300px] relative">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#4c1d95] text-[26px] tracking-[-1.2px] whitespace-nowrap">
        <p className="leading-[32px]">L + SIVILIMA</p>
      </div>
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[19px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
        <g id="Frame 9">
          <path d={svgPaths.p347c6c00} fill="var(--fill-0, #6D28D9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[46px] items-center relative shrink-0">
      <Frame1 />
    </div>
  );
}

export default function Homepage() {
  return (
    <div className="bg-[#fbf8ff] relative size-full" data-name="Homepage">
      <ContentWrapper />
      <div className="absolute bg-[rgba(240,240,240,0.78)] content-center flex flex-wrap gap-y-[89px] h-[80px] items-center justify-between left-0 px-[30px] py-[20px] right-0 top-0" data-name="Tab Section 2">
        <Frame2 />
        <Frame3 />
      </div>
    </div>
  );
}