var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/pathfinder.js
var pathfinder_exports = {};
__export(pathfinder_exports, {
  findShortestPath: () => findShortestPath
});
module.exports = __toCommonJS(pathfinder_exports);

// src/data/stations.js
var baseLinesData = {
  "1": {
    name: "1",
    label: "1\uD638\uC120",
    color: "#0052A4",
    stations: ["\uC5F0\uCC9C", "\uC804\uACE1", "\uCCAD\uC0B0", "\uC18C\uC694\uC0B0", "\uB3D9\uB450\uCC9C", "\uBCF4\uC0B0", "\uB3D9\uB450\uCC9C\uC911\uC559", "\uC9C0\uD589", "\uB355\uC815", "\uB355\uACC4", "\uC591\uC8FC", "\uB179\uC591", "\uAC00\uB2A5", "\uC758\uC815\uBD80", "\uD68C\uB8E1", "\uB9DD\uC6D4\uC0AC", "\uB3C4\uBD09\uC0B0", "\uB3C4\uBD09", "\uBC29\uD559", "\uCC3D\uB3D9", "\uB179\uCC9C", "\uC6D4\uACC4", "\uAD11\uC6B4\uB300", "\uC11D\uACC4", "\uC2E0\uC774\uBB38", "\uC678\uB300\uC55E", "\uD68C\uAE30", "\uCCAD\uB7C9\uB9AC", "\uC81C\uAE30\uB3D9", "\uC2E0\uC124\uB3D9", "\uB3D9\uBB18\uC55E", "\uB3D9\uB300\uBB38", "\uC885\uB85C5\uAC00", "\uC885\uB85C3\uAC00", "\uC885\uAC01", "\uC2DC\uCCAD", "\uC11C\uC6B8\uC5ED", "\uB0A8\uC601", "\uC6A9\uC0B0", "\uB178\uB7C9\uC9C4", "\uB300\uBC29", "\uC2E0\uAE38", "\uC601\uB4F1\uD3EC", "\uC2E0\uB3C4\uB9BC", "\uAD6C\uB85C", "\uAD6C\uC77C", "\uAC1C\uBD09", "\uC624\uB958\uB3D9", "\uC628\uC218", "\uC5ED\uACE1", "\uC18C\uC0AC", "\uBD80\uCC9C", "\uC911\uB3D9", "\uC1A1\uB0B4", "\uBD80\uAC1C", "\uBD80\uD3C9", "\uBC31\uC6B4", "\uB3D9\uC554", "\uAC04\uC11D", "\uC8FC\uC548", "\uB3C4\uD654", "\uC81C\uBB3C\uD3EC", "\uB3C4\uC6D0", "\uB3D9\uC778\uCC9C", "\uC778\uCC9C"].map((name, i) => ({ id: 1e3 + i, name }))
  },
  "1-sinchang": {
    name: "1",
    label: "1\uD638\uC120(\uC2E0\uCC3D)",
    color: "#0052A4",
    stations: ["\uAD6C\uB85C", "\uAC00\uC0B0\uB514\uC9C0\uD138\uB2E8\uC9C0", "\uB3C5\uC0B0", "\uAE08\uCC9C\uAD6C\uCCAD", "\uC11D\uC218", "\uAD00\uC545", "\uC548\uC591", "\uBA85\uD559", "\uAE08\uC815", "\uAD70\uD3EC", "\uB2F9\uC815", "\uC758\uC655", "\uC131\uADE0\uAD00\uB300", "\uD654\uC11C", "\uC218\uC6D0", "\uC138\uB958", "\uBCD1\uC810", "\uC138\uB9C8", "\uC624\uC0B0\uB300", "\uC624\uC0B0", "\uC9C4\uC704", "\uC1A1\uD0C4", "\uC11C\uC815\uB9AC", "\uD3C9\uD0DD\uC9C0\uC81C", "\uD3C9\uD0DD", "\uC131\uD658", "\uC9C1\uC0B0", "\uB450\uC815", "\uCC9C\uC548", "\uBD09\uBA85", "\uC30D\uC6A9(\uB098\uC0AC\uB81B\uB300)", "\uC544\uC0B0", "\uD0D5\uC815", "\uBC30\uBC29", "\uC628\uC591\uC628\uCC9C", "\uC2E0\uCC3D"].map((name, i) => ({ id: 1100 + i, name }))
  },
  "1-gwangmyeong": {
    name: "1",
    label: "1\uD638\uC120(\uAD11\uBA85)",
    color: "#0052A4",
    stations: ["\uAE08\uCC9C\uAD6C\uCCAD", "\uAD11\uBA85"].map((name, i) => ({ id: 1200 + i, name }))
  },
  "1-seodongtan": {
    name: "1",
    label: "1\uD638\uC120(\uC11C\uB3D9\uD0C4)",
    color: "#0052A4",
    stations: ["\uBCD1\uC810", "\uC11C\uB3D9\uD0C4"].map((name, i) => ({ id: 1300 + i, name }))
  },
  "1-express-gyeongin": {
    name: "1",
    label: "1\uD638\uC120(\uAE09\uD589)",
    color: "#0052A4",
    stations: ["\uC6A9\uC0B0", "\uB178\uB7C9\uC9C4", "\uB300\uBC29", "\uC2E0\uAE38", "\uC601\uB4F1\uD3EC", "\uC2E0\uB3C4\uB9BC", "\uAD6C\uB85C", "\uAC1C\uBD09", "\uC5ED\uACE1", "\uBD80\uCC9C", "\uC1A1\uB0B4", "\uBD80\uD3C9", "\uB3D9\uC554", "\uC8FC\uC548", "\uC81C\uBB3C\uD3EC", "\uB3D9\uC778\uCC9C"].map((name, i) => ({ id: 1400 + i, name }))
  },
  "1-express-gyeongbu": {
    name: "1",
    label: "1\uD638\uC120(\uAE09\uD589)",
    color: "#0052A4",
    stations: ["\uCCAD\uB7C9\uB9AC", "\uC81C\uAE30\uB3D9", "\uC2E0\uC124\uB3D9", "\uB3D9\uBB18\uC55E", "\uB3D9\uB300\uBB38", "\uC885\uB85C5\uAC00", "\uC885\uB85C3\uAC00", "\uC885\uAC01", "\uC2DC\uCCAD", "\uC11C\uC6B8\uC5ED", "\uB0A8\uC601", "\uC6A9\uC0B0", "\uB178\uB7C9\uC9C4", "\uB300\uBC29", "\uC2E0\uAE38", "\uC601\uB4F1\uD3EC", "\uC2E0\uB3C4\uB9BC", "\uAD6C\uB85C", "\uAC00\uC0B0\uB514\uC9C0\uD138\uB2E8\uC9C0", "\uC548\uC591", "\uAE08\uC815", "\uC131\uADE0\uAD00\uB300", "\uC218\uC6D0", "\uBCD1\uC810", "\uC624\uC0B0", "\uC11C\uC815\uB9AC", "\uD3C9\uD0DD", "\uC131\uD658", "\uB450\uC815", "\uCC9C\uC548", "\uBD09\uBA85", "\uC30D\uC6A9(\uB098\uC0AC\uB81B\uB300)", "\uC544\uC0B0", "\uD0D5\uC815", "\uBC30\uBC29", "\uC628\uC591\uC628\uCC9C", "\uC2E0\uCC3D"].map((name, i) => ({ id: 1500 + i, name }))
  },
  "2": {
    name: "2",
    label: "2\uD638\uC120",
    color: "#00A84D",
    stations: ["\uC2DC\uCCAD", "\uC744\uC9C0\uB85C\uC785\uAD6C", "\uC744\uC9C0\uB85C3\uAC00", "\uC744\uC9C0\uB85C4\uAC00", "\uB3D9\uB300\uBB38\uC5ED\uC0AC\uBB38\uD654\uACF5\uC6D0", "\uC2E0\uB2F9", "\uC0C1\uC655\uC2ED\uB9AC", "\uC655\uC2ED\uB9AC", "\uD55C\uC591\uB300", "\uB69D\uC12C", "\uC131\uC218", "\uAC74\uB300\uC785\uAD6C", "\uAD6C\uC758", "\uAC15\uBCC0", "\uC7A0\uC2E4\uB098\uB8E8", "\uC7A0\uC2E4", "\uC7A0\uC2E4\uC0C8\uB0B4", "\uC885\uD569\uC6B4\uB3D9\uC7A5", "\uC0BC\uC131", "\uC120\uB989", "\uC5ED\uC0BC", "\uAC15\uB0A8", "\uAD50\uB300", "\uC11C\uCD08", "\uBC29\uBC30", "\uC0AC\uB2F9", "\uB099\uC131\uB300", "\uC11C\uC6B8\uB300\uC785\uAD6C", "\uBD09\uCC9C", "\uC2E0\uB9BC", "\uC2E0\uB300\uBC29", "\uAD6C\uB85C\uB514\uC9C0\uD138\uB2E8\uC9C0", "\uB300\uB9BC", "\uC2E0\uB3C4\uB9BC", "\uBB38\uB798", "\uC601\uB4F1\uD3EC\uAD6C\uCCAD", "\uB2F9\uC0B0", "\uD569\uC815", "\uD64D\uB300\uC785\uAD6C", "\uC2E0\uCD0C", "\uC774\uB300", "\uC544\uD604", "\uCDA9\uC815\uB85C"].map((name, i) => ({ id: 2e3 + i, name }))
  },
  "3": {
    name: "3",
    label: "3\uD638\uC120",
    color: "#EF7C1C",
    stations: ["\uB300\uD654", "\uC8FC\uC5FD", "\uC815\uBC1C\uC0B0", "\uB9C8\uB450", "\uBC31\uC11D", "\uB300\uACE1", "\uD654\uC815", "\uC6D0\uB2F9", "\uC6D0\uD765", "\uC0BC\uC1A1", "\uC9C0\uCD95", "\uAD6C\uD30C\uBC1C", "\uC5F0\uC2E0\uB0B4", "\uBD88\uAD11", "\uB179\uBC88", "\uD64D\uC81C", "\uBB34\uC545\uC7AC", "\uB3C5\uB9BD\uBB38", "\uACBD\uBCF5\uAD81", "\uC548\uAD6D", "\uC885\uB85C3\uAC00", "\uC744\uC9C0\uB85C3\uAC00", "\uCDA9\uBB34\uB85C", "\uB3D9\uB300\uC785\uAD6C", "\uC57D\uC218", "\uAE08\uD638", "\uC625\uC218", "\uC555\uAD6C\uC815", "\uC2E0\uC0AC", "\uC7A0\uC6D0", "\uACE0\uC18D\uD130\uBBF8\uB110", "\uAD50\uB300", "\uB0A8\uBD80\uD130\uBBF8\uB110", "\uC591\uC7AC", "\uB9E4\uBD09", "\uB3C4\uACE1", "\uB300\uCE58", "\uD559\uC5EC\uC6B8", "\uB300\uCCAD", "\uC77C\uC6D0", "\uC218\uC11C", "\uAC00\uB77D\uC2DC\uC7A5", "\uACBD\uCC30\uBCD1\uC6D0", "\uC624\uAE08"].map((name, i) => ({ id: 3e3 + i, name }))
  },
  "4": {
    name: "4",
    label: "4\uD638\uC120",
    color: "#00A5DE",
    stations: ["\uC9C4\uC811", "\uC624\uB0A8", "\uBCC4\uB0B4\uBCC4\uAC00\uB78C", "\uB2F9\uACE0\uAC1C", "\uC0C1\uACC4", "\uB178\uC6D0", "\uCC3D\uB3D9", "\uC30D\uBB38", "\uC218\uC720", "\uBBF8\uC544", "\uBBF8\uC544\uC0AC\uAC70\uB9AC", "\uAE38\uC74C", "\uC131\uC2E0\uC5EC\uB300\uC785\uAD6C", "\uD55C\uC131\uB300\uC785\uAD6C", "\uD61C\uD654", "\uB3D9\uB300\uBB38", "\uB3D9\uB300\uBB38\uC5ED\uC0AC\uBB38\uD654\uACF5\uC6D0", "\uCDA9\uBB34\uB85C", "\uBA85\uB3D9", "\uD68C\uD604", "\uC11C\uC6B8\uC5ED", "\uC219\uB300\uC785\uAD6C", "\uC0BC\uAC01\uC9C0", "\uC2E0\uC6A9\uC0B0", "\uC774\uCD0C", "\uB3D9\uC791", "\uCD1D\uC2E0\uB300\uC785\uAD6C(\uC774\uC218)", "\uC0AC\uB2F9", "\uB0A8\uD0DC\uB839", "\uC120\uBC14\uC704", "\uACBD\uB9C8\uACF5\uC6D0", "\uB300\uACF5\uC6D0", "\uACFC\uCC9C", "\uC815\uBD80\uACFC\uCC9C\uCCAD\uC0AC", "\uC778\uB355\uC6D0", "\uD3C9\uCD0C", "\uBC94\uACC4", "\uAE08\uC815", "\uC0B0\uBCF8", "\uC218\uB9AC\uC0B0", "\uB300\uC57C\uBBF8", "\uBC18\uC6D4", "\uC0C1\uB85D\uC218", "\uD55C\uB300\uC55E", "\uC911\uC559", "\uACE0\uC794", "\uCD08\uC9C0", "\uC548\uC0B0", "\uC2E0\uAE38\uC628\uCC9C", "\uC815\uC655", "\uC624\uC774\uB3C4"].map((name, i) => ({ id: 4e3 + i, name }))
  },
  "4-express": {
    name: "4",
    label: "4\uD638\uC120(\uAE09\uD589)",
    color: "#00A5DE",
    stations: ["\uB2F9\uACE0\uAC1C", "\uC0C1\uACC4", "\uB178\uC6D0", "\uCC3D\uB3D9", "\uC30D\uBB38", "\uC218\uC720", "\uBBF8\uC544", "\uBBF8\uC544\uC0AC\uAC70\uB9AC", "\uAE38\uC74C", "\uC131\uC2E0\uC5EC\uB300\uC785\uAD6C", "\uD55C\uC131\uB300\uC785\uAD6C", "\uD61C\uD654", "\uB3D9\uB300\uBB38", "\uB3D9\uB300\uBB38\uC5ED\uC0AC\uBB38\uD654\uACF5\uC6D0", "\uCDA9\uBB34\uB85C", "\uBA85\uB3D9", "\uD68C\uD604", "\uC11C\uC6B8\uC5ED", "\uC219\uB300\uC785\uAD6C", "\uC0BC\uAC01\uC9C0", "\uC2E0\uC6A9\uC0B0", "\uC774\uCD0C", "\uB3D9\uC791", "\uCD1D\uC2E0\uB300\uC785\uAD6C(\uC774\uC218)", "\uC0AC\uB2F9", "\uB0A8\uD0DC\uB839", "\uC120\uBC14\uC704", "\uACBD\uB9C8\uACF5\uC6D0", "\uB300\uACF5\uC6D0", "\uACFC\uCC9C", "\uC815\uBD80\uACFC\uCC9C\uCCAD\uC0AC", "\uC778\uB355\uC6D0", "\uD3C9\uCD0C", "\uBC94\uACC4", "\uAE08\uC815", "\uC0B0\uBCF8", "\uC0C1\uB85D\uC218", "\uC911\uC559", "\uCD08\uC9C0", "\uC548\uC0B0", "\uC815\uC655", "\uC624\uC774\uB3C4"].map((name, i) => ({ id: 4500 + i, name }))
  },
  "5": {
    name: "5",
    label: "5\uD638\uC120",
    color: "#996CAC",
    stations: ["\uBC29\uD654", "\uAC1C\uD654\uC0B0", "\uAE40\uD3EC\uACF5\uD56D", "\uC1A1\uC815", "\uB9C8\uACE1", "\uBC1C\uC0B0", "\uC6B0\uC7A5\uC0B0", "\uD654\uACE1", "\uAE4C\uCE58\uC0B0", "\uC2E0\uC815", "\uBAA9\uB3D9", "\uC624\uBAA9\uAD50", "\uC591\uD3C9", "\uC601\uB4F1\uD3EC\uAD6C\uCCAD", "\uC601\uB4F1\uD3EC\uC2DC\uC7A5", "\uC2E0\uAE38", "\uC5EC\uC758\uB3C4", "\uC5EC\uC758\uB098\uB8E8", "\uB9C8\uD3EC", "\uACF5\uB355", "\uC560\uC624\uAC1C", "\uCDA9\uC815\uB85C", "\uC11C\uB300\uBB38", "\uAD11\uD654\uBB38", "\uC885\uB85C3\uAC00", "\uC744\uC9C0\uB85C4\uAC00", "\uB3D9\uB300\uBB38\uC5ED\uC0AC\uBB38\uD654\uACF5\uC6D0", "\uCCAD\uAD6C", "\uC2E0\uAE08\uD638", "\uD589\uB2F9", "\uC655\uC2ED\uB9AC", "\uB9C8\uC7A5", "\uB2F5\uC2ED\uB9AC", "\uC7A5\uD55C\uD3C9", "\uAD70\uC790", "\uC544\uCC28\uC0B0", "\uAD11\uB098\uB8E8", "\uCC9C\uD638", "\uAC15\uB3D9", "\uAE38\uB3D9", "\uAD7D\uC740\uB2E4\uB9AC", "\uBA85\uC77C", "\uACE0\uB355", "\uC0C1\uC77C\uB3D9", "\uAC15\uC77C", "\uBBF8\uC0AC", "\uD558\uB0A8\uD48D\uC0B0", "\uD558\uB0A8\uC2DC\uCCAD", "\uD558\uB0A8\uAC80\uB2E8\uC0B0"].map((name, i) => ({ id: 5e3 + i, name }))
  },
  "6": {
    name: "6",
    label: "6\uD638\uC120",
    color: "#CD7C2F",
    stations: ["\uC751\uC554", "\uC5ED\uCD0C", "\uBD88\uAD11", "\uB3C5\uBC14\uC704", "\uC5F0\uC2E0\uB0B4", "\uAD6C\uC0B0", "\uC0C8\uC808", "\uC99D\uC0B0", "\uB514\uC9C0\uD138\uBBF8\uB514\uC5B4\uC2DC\uD2F0", "\uC6D4\uB4DC\uCEF5\uACBD\uAE30\uC7A5", "\uB9C8\uD3EC\uAD6C\uCCAD", "\uB9DD\uC6D0", "\uD569\uC815", "\uC0C1\uC218", "\uAD11\uD765\uCC3D", "\uB300\uD765", "\uACF5\uB355", "\uD6A8\uCC3D\uACF5\uC6D0\uC55E", "\uC0BC\uAC01\uC9C0", "\uB179\uC0AC\uD3C9", "\uC774\uD0DC\uC6D0", "\uD55C\uAC15\uC9C4", "\uBC84\uD2F0\uACE0\uAC1C", "\uC57D\uC218", "\uCCAD\uAD6C", "\uC2E0\uB2F9", "\uB3D9\uBB18\uC55E", "\uCC3D\uC2E0", "\uBCF4\uBB38", "\uC548\uC554", "\uACE0\uB824\uB300", "\uC6D4\uACE1", "\uC0C1\uC6D4\uACE1", "\uB3CC\uACF6\uC774", "\uC11D\uACC4", "\uD0DC\uB989\uC785\uAD6C", "\uD654\uB791\uB300", "\uBD09\uD654\uC0B0", "\uC2E0\uB0B4"].map((name, i) => ({ id: 6e3 + i, name }))
  },
  "7": {
    name: "7",
    label: "7\uD638\uC120",
    color: "#747F00",
    stations: ["\uC7A5\uC554", "\uB3C4\uBD09\uC0B0", "\uC218\uB77D\uC0B0", "\uB9C8\uB4E4", "\uB178\uC6D0", "\uC911\uACC4", "\uD558\uACC4", "\uACF5\uB989", "\uD0DC\uB989\uC785\uAD6C", "\uBA39\uACE8", "\uC911\uD654", "\uC0C1\uBD09", "\uBA74\uBAA9", "\uC0AC\uAC00\uC815", "\uC6A9\uB9C8\uC0B0", "\uC911\uACE1", "\uAD70\uC790", "\uC5B4\uB9B0\uC774\uB300\uACF5\uC6D0", "\uAC74\uB300\uC785\uAD6C", "\uB69D\uC12C\uC720\uC6D0\uC9C0", "\uCCAD\uB2F4", "\uAC15\uB0A8\uAD6C\uCCAD", "\uD559\uB3D9", "\uB17C\uD604", "\uBC18\uD3EC", "\uACE0\uC18D\uD130\uBBF8\uB110", "\uB0B4\uBC29", "\uCD1D\uC2E0\uB300\uC785\uAD6C(\uC774\uC218)", "\uB0A8\uC131", "\uC22D\uC2E4\uB300\uC785\uAD6C", "\uC0C1\uB3C4", "\uC7A5\uC2B9\uBC30\uAE30", "\uC2E0\uB300\uBC29\uC0BC\uAC70\uB9AC", "\uBCF4\uB77C\uB9E4", "\uC2E0\uD48D", "\uB300\uB9BC", "\uB0A8\uAD6C\uB85C", "\uAC00\uC0B0\uB514\uC9C0\uD138\uB2E8\uC9C0", "\uCCA0\uC0B0", "\uAD11\uBA85\uC0AC\uAC70\uB9AC", "\uCC9C\uC655", "\uC628\uC218", "\uAE4C\uCE58\uC6B8", "\uBD80\uCC9C\uC885\uD569\uC6B4\uB3D9\uC7A5", "\uCD98\uC758", "\uC2E0\uC911\uB3D9", "\uBD80\uCC9C\uC2DC\uCCAD", "\uC0C1\uB3D9", "\uC0BC\uC0B0\uCCB4\uC721\uAD00", "\uAD74\uD3EC\uCC9C", "\uBD80\uD3C9\uAD6C\uCCAD", "\uC0B0\uACE1", "\uC11D\uB0A8"].map((name, i) => ({ id: 7e3 + i, name }))
  },
  "8": {
    name: "8",
    label: "8\uD638\uC120",
    color: "#E6186C",
    stations: ["\uBCC4\uB0B4", "\uB2E4\uC0B0", "\uB3D9\uAD6C\uB989", "\uAD6C\uB9AC", "\uC7A5\uC790\uD638\uC218\uACF5\uC6D0", "\uC554\uC0AC\uC5ED\uC0AC\uACF5\uC6D0", "\uC554\uC0AC", "\uCC9C\uD638", "\uAC15\uB3D9\uAD6C\uCCAD", "\uBABD\uCD0C\uD1A0\uC131", "\uC7A0\uC2E4", "\uC11D\uCD0C", "\uC1A1\uD30C", "\uAC00\uB77D\uC2DC\uC7A5", "\uBB38\uC815", "\uC7A5\uC9C0", "\uBCF5\uC815", "\uB0A8\uC704\uB840", "\uC0B0\uC131", "\uB0A8\uD55C\uC0B0\uC131\uC785\uAD6C", "\uB2E8\uB300\uC624\uAC70\uB9AC", "\uC2E0\uD765", "\uC218\uC9C4", "\uBAA8\uB780"].map((name, i) => ({ id: 8e3 + i, name }))
  },
  "9": {
    name: "9",
    label: "9\uD638\uC120",
    color: "#BDB092",
    stations: ["\uAC1C\uD654", "\uAE40\uD3EC\uACF5\uD56D", "\uACF5\uD56D\uC2DC\uC7A5", "\uC2E0\uBC29\uD654", "\uB9C8\uACE1\uB098\uB8E8", "\uC591\uCC9C\uD5A5\uAD50", "\uAC00\uC591", "\uC99D\uBBF8", "\uB4F1\uCD0C", "\uC5FC\uCC3D", "\uC2E0\uBAA9\uB3D9", "\uC120\uC720\uB3C4", "\uB2F9\uC0B0", "\uAD6D\uD68C\uC758\uC0AC\uB2F9", "\uC5EC\uC758\uB3C4", "\uC0DB\uAC15", "\uB178\uB4E4", "\uD751\uC11D", "\uB3D9\uC791", "\uAD6C\uBC18\uD3EC", "\uC2E0\uBC18\uD3EC", "\uACE0\uC18D\uD130\uBBF8\uB110", "\uC0AC\uD3C9", "\uC2E0\uB17C\uD604", "\uC5B8\uC8FC", "\uC120\uC815\uB989", "\uC0BC\uC131\uC911\uC559", "\uBD09\uC740\uC0AC", "\uC885\uD569\uC6B4\uB3D9\uC7A5", "\uC0BC\uC804", "\uC11D\uCD0C\uACE0\uBD84", "\uC11D\uCD0C", "\uC1A1\uD30C\uB098\uB8E8", "\uD55C\uC131\uBC31\uC81C", "\uC62C\uB9BC\uD53D\uACF5\uC6D0", "\uB454\uCD0C\uC624\uB95C", "\uC911\uC559\uBCF4\uD6C8\uBCD1\uC6D0"].map((name, i) => ({ id: 9e3 + i, name }))
  },
  "9-express": {
    name: "9",
    label: "9\uD638\uC120(\uAE09\uD589)",
    color: "#BDB092",
    stations: ["\uAE40\uD3EC\uACF5\uD56D", "\uB9C8\uACE1\uB098\uB8E8", "\uAC00\uC591", "\uC5FC\uCC3D", "\uB2F9\uC0B0", "\uC5EC\uC758\uB3C4", "\uB178\uB7C9\uC9C4", "\uB3D9\uC791", "\uACE0\uC18D\uD130\uBBF8\uB110", "\uC2E0\uB17C\uD604", "\uC120\uC815\uB989", "\uBD09\uC740\uC0AC", "\uC885\uD569\uC6B4\uB3D9\uC7A5", "\uC11D\uCD0C", "\uC62C\uB9BC\uD53D\uACF5\uC6D0", "\uC911\uC559\uBCF4\uD6C8\uBCD1\uC6D0"].map((name, i) => ({ id: 9500 + i, name }))
  },
  "suin": {
    name: "\uBD84\uB2F9",
    label: "\uC218\uC778\uBD84\uB2F9\uC120",
    color: "#FABE00",
    stations: ["\uCCAD\uB7C9\uB9AC", "\uC655\uC2ED\uB9AC", "\uC11C\uC6B8\uC232", "\uC555\uAD6C\uC815\uB85C\uB370\uC624", "\uAC15\uB0A8\uAD6C\uCCAD", "\uC120\uC815\uB989", "\uC120\uB989", "\uD55C\uD2F0", "\uB3C4\uACE1", "\uAD6C\uB8E1", "\uAC1C\uD3EC\uB3D9", "\uB300\uBAA8\uC0B0\uC785\uAD6C", "\uC218\uC11C", "\uBCF5\uC815", "\uAC00\uCC9C\uB300", "\uD0DC\uD3C9", "\uBAA8\uB780", "\uC57C\uD0D1", "\uC774\uB9E4", "\uC11C\uD604", "\uC218\uB0B4", "\uC815\uC790", "\uBBF8\uAE08", "\uC624\uB9AC", "\uC8FD\uC804", "\uBCF4\uC815", "\uAD6C\uC131", "\uC2E0\uAC08", "\uAE30\uD765", "\uC0C1\uAC08", "\uCCAD\uBA85", "\uC601\uD1B5", "\uB9DD\uD3EC", "\uB9E4\uD0C4\uAD8C\uC120", "\uC218\uC6D0\uC2DC\uCCAD", "\uB9E4\uAD50", "\uC218\uC6D0", "\uACE0\uC0C9", "\uC624\uBAA9\uCC9C", "\uC5B4\uCC9C", "\uC57C\uBAA9", "\uC0AC\uB9AC", "\uD55C\uB300\uC55E", "\uC911\uC559", "\uACE0\uC794", "\uCD08\uC9C0", "\uC548\uC0B0", "\uC2E0\uAE38\uC628\uCC9C", "\uC815\uC655", "\uC624\uC774\uB3C4", "\uB2EC\uC6D4", "\uC6D4\uACF6", "\uC18C\uB798\uD3EC\uAD6C", "\uC778\uCC9C\uB17C\uD604", "\uD638\uAD6C\uD3EC", "\uB0A8\uB3D9\uC778\uB354\uC2A4\uD30C\uD06C", "\uC6D0\uC778\uC7AC", "\uC5F0\uC218", "\uC1A1\uB3C4", "\uD559\uC775", "\uC778\uD558\uB300", "\uC22D\uC758", "\uC2E0\uD3EC", "\uC778\uCC9C"].map((name, i) => ({ id: 1e4 + i, name }))
  },
  "suin-express-bundang": {
    name: "\uBD84\uB2F9",
    label: "\uC218\uC778\uBD84\uB2F9\uC120(\uAE09\uD589)",
    color: "#FABE00",
    stations: ["\uC655\uC2ED\uB9AC", "\uC11C\uC6B8\uC232", "\uC555\uAD6C\uC815\uB85C\uB370\uC624", "\uAC15\uB0A8\uAD6C\uCCAD", "\uC120\uC815\uB989", "\uC120\uB989", "\uD55C\uD2F0", "\uB3C4\uACE1", "\uAD6C\uB8E1", "\uAC1C\uD3EC\uB3D9", "\uB300\uBAA8\uC0B0\uC785\uAD6C", "\uC218\uC11C", "\uBCF5\uC815", "\uAC00\uCC9C\uB300", "\uD0DC\uD3C9", "\uBAA8\uB780", "\uC57C\uD0D1", "\uC774\uB9E4", "\uC11C\uD604", "\uC218\uB0B4", "\uC815\uC790", "\uBBF8\uAE08", "\uC624\uB9AC", "\uC8FD\uC804", "\uBCF4\uC815", "\uAD6C\uC131", "\uC2E0\uAC08", "\uAE30\uD765", "\uC0C1\uAC08", "\uCCAD\uBA85", "\uC601\uD1B5", "\uB9DD\uD3EC", "\uB9E4\uD0C4\uAD8C\uC120", "\uC218\uC6D0\uC2DC\uCCAD", "\uB9E4\uAD50", "\uC218\uC6D0", "\uACE0\uC0C9"].map((name, i) => ({ id: 10500 + i, name }))
  },
  "suin-express-suin": {
    name: "\uBD84\uB2F9",
    label: "\uC218\uC778\uBD84\uB2F9\uC120(\uAE09\uD589)",
    color: "#FABE00",
    stations: ["\uC624\uC774\uB3C4", "\uC18C\uB798\uD3EC\uAD6C", "\uC778\uCC9C\uB17C\uD604", "\uD638\uAD6C\uD3EC", "\uB0A8\uB3D9\uC778\uB354\uC2A4\uD30C\uD06C", "\uC6D0\uC778\uC7AC", "\uC5F0\uC218", "\uC778\uD558\uB300", "\uC778\uCC9C"].map((name, i) => ({ id: 10600 + i, name }))
  },
  "shin": {
    name: "\uC2E0\uBD84\uB2F9",
    label: "\uC2E0\uBD84\uB2F9\uC120",
    color: "#D4003B",
    stations: ["\uC2E0\uC0AC", "\uB17C\uD604", "\uC2E0\uB17C\uD604", "\uAC15\uB0A8", "\uC591\uC7AC", "\uC591\uC7AC\uC2DC\uBBFC\uC758\uC232", "\uCCAD\uACC4\uC0B0\uC785\uAD6C", "\uD310\uAD50", "\uC815\uC790", "\uBBF8\uAE08", "\uB3D9\uCC9C", "\uC218\uC9C0\uAD6C\uCCAD", "\uC131\uBCF5", "\uC0C1\uD604", "\uAD11\uAD50\uC911\uC559", "\uAD11\uAD50"].map((name, i) => ({ id: 11e3 + i, name }))
  },
  "gyeongui": {
    name: "\uACBD\uC758\uC911\uC559",
    label: "\uACBD\uC758\uC911\uC559\uC120",
    color: "#77C4A3",
    stations: ["\uC784\uC9C4\uAC15", "\uC6B4\uCC9C", "\uBB38\uC0B0", "\uD30C\uC8FC", "\uC6D4\uB871", "\uAE08\uCD0C", "\uAE08\uB989", "\uC6B4\uC815", "\uC57C\uB2F9", "\uD0C4\uD604", "\uC77C\uC0B0", "\uD48D\uC0B0", "\uBC31\uB9C8", "\uACE1\uC0B0", "\uB300\uACE1", "\uB2A5\uACE1", "\uD589\uC2E0", "\uAC15\uB9E4", "\uD654\uC804", "\uC218\uC0C9", "\uB514\uC9C0\uD138\uBBF8\uB514\uC5B4\uC2DC\uD2F0", "\uAC00\uC88C", "\uC2E0\uCD0C", "\uC11C\uC6B8\uC5ED", "\uD64D\uB300\uC785\uAD6C", "\uC11C\uAC15\uB300", "\uACF5\uB355", "\uD6A8\uCC3D\uACF5\uC6D0\uC55E", "\uC6A9\uC0B0", "\uC774\uCD0C", "\uC11C\uBE59\uACE0", "\uD55C\uB0A8", "\uC625\uC218", "\uC751\uBD09", "\uC655\uC2ED\uB9AC", "\uCCAD\uB7C9\uB9AC", "\uD68C\uAE30", "\uC911\uB791", "\uC0C1\uBD09", "\uB9DD\uC6B0", "\uC591\uC6D0", "\uAD6C\uB9AC", "\uB3C4\uB18D", "\uC591\uC815", "\uB355\uC18C", "\uB3C4\uC2EC", "\uD314\uB2F9", "\uC6B4\uAE38\uC0B0", "\uC591\uC218", "\uC2E0\uC6D0", "\uAD6D\uC218", "\uC544\uC2E0", "\uC624\uBE48", "\uC591\uD3C9", "\uC6D0\uB355", "\uC6A9\uBB38", "\uC9C0\uD3C9"].map((name, i) => ({ id: 12e3 + i, name }))
  },
  "gyeongui-express": {
    name: "\uACBD\uC758\uC911\uC559",
    label: "\uACBD\uC758\uC911\uC559\uC120(\uAE09\uD589)",
    color: "#77C4A3",
    stations: ["\uBB38\uC0B0", "\uAE08\uCD0C", "\uAE08\uB989", "\uC6B4\uC815", "\uC57C\uB2F9", "\uC77C\uC0B0", "\uBC31\uB9C8", "\uB300\uACE1", "\uD589\uC2E0", "\uAC00\uC88C", "\uD64D\uB300\uC785\uAD6C", "\uACF5\uB355", "\uC6A9\uC0B0", "\uC774\uCD0C", "\uC625\uC218", "\uC655\uC2ED\uB9AC", "\uCCAD\uB7C9\uB9AC", "\uD68C\uAE30", "\uC0C1\uBD09", "\uAD6C\uB9AC", "\uB3C4\uB18D", "\uB355\uC18C", "\uB3C4\uC2EC", "\uC591\uC218", "\uC591\uD3C9", "\uC6A9\uBB38"].map((name, i) => ({ id: 12500 + i, name }))
  },
  "airport": {
    name: "\uACF5\uD56D",
    label: "\uACF5\uD56D\uCCA0\uB3C4",
    color: "#0090D2",
    stations: ["\uC11C\uC6B8\uC5ED", "\uACF5\uB355", "\uD64D\uB300\uC785\uAD6C", "\uB514\uC9C0\uD138\uBBF8\uB514\uC5B4\uC2DC\uD2F0", "\uB9C8\uACE1\uB098\uB8E8", "\uAE40\uD3EC\uACF5\uD56D", "\uACC4\uC591", "\uAC80\uC554", "\uCCAD\uB77C\uAD6D\uC81C\uB3C4\uC2DC", "\uC601\uC885", "\uC6B4\uC11C", "\uACF5\uD56D\uD654\uBB3C\uCCAD\uC0AC", "\uC778\uCC9C\uACF5\uD56D1\uD130\uBBF8\uB110", "\uC778\uCC9C\uACF5\uD56D2\uD130\uBBF8\uB110"].map((name, i) => ({ id: 13e3 + i, name }))
  },
  "incheon1": {
    name: "\uC778\uCC9C1",
    label: "\uC778\uCC9C 1\uD638\uC120",
    color: "#7CA8D5",
    stations: ["\uACC4\uC591", "\uADE4\uD604", "\uBC15\uCD0C", "\uC784\uD559", "\uACC4\uC0B0", "\uACBD\uC778\uAD50\uB300\uC785\uAD6C", "\uC791\uC804", "\uAC08\uC0B0", "\uBD80\uD3C9\uAD6C\uCCAD", "\uBD80\uD3C9\uC2DC\uC7A5", "\uBD80\uD3C9", "\uB3D9\uC218", "\uBD80\uD3C9\uC0BC\uAC70\uB9AC", "\uAC04\uC11D\uC624\uAC70\uB9AC", "\uC778\uCC9C\uC2DC\uCCAD", "\uC608\uC220\uD68C\uAD00", "\uC778\uCC9C\uD130\uBBF8\uB110", "\uBB38\uD559\uACBD\uAE30\uC7A5", "\uC120\uD559", "\uC2E0\uC5F0\uC218", "\uC6D0\uC778\uC7AC", "\uB3D9\uCD98", "\uB3D9\uB9C9", "\uCEA0\uD37C\uC2A4\uD0C0\uC6B4", "\uD14C\uD06C\uB178\uD30C\uD06C", "\uC9C0\uC2DD\uC815\uBCF4\uB2E8\uC9C0", "\uC778\uCC9C\uB300\uC785\uAD6C", "\uC13C\uD2B8\uB7F4\uD30C\uD06C", "\uAD6D\uC81C\uC5C5\uBB34\uC9C0\uAD6C", "\uC1A1\uB3C4\uB2EC\uBE5B\uCD95\uC81C\uACF5\uC6D0"].map((name, i) => ({ id: 14e3 + i, name }))
  },
  "incheon2": {
    name: "\uC778\uCC9C2",
    label: "\uC778\uCC9C 2\uD638\uC120",
    color: "#ED8B00",
    stations: ["\uAC80\uB2E8\uC624\uB958", "\uC655\uAE38", "\uAC80\uB2E8\uC0AC\uAC70\uB9AC", "\uB9C8\uC804", "\uC644\uC815", "\uB3C5\uC815", "\uAC80\uC554", "\uAC80\uBC14\uC704", "\uC544\uC2DC\uC544\uB4DC\uACBD\uAE30\uC7A5", "\uC11C\uAD6C\uCCAD", "\uAC00\uC815", "\uAC00\uC815\uC911\uC559\uC2DC\uC7A5", "\uC11D\uB0A8", "\uC11C\uBD80\uC5EC\uC131\uD68C\uAD00", "\uC778\uCC9C\uAC00\uC88C", "\uAC00\uC7AC\uC6B8", "\uC8FC\uC548\uAD6D\uAC00\uC0B0\uB2E8", "\uC8FC\uC548", "\uC2DC\uBBFC\uACF5\uC6D0", "\uC11D\uBC14\uC704\uC2DC\uC7A5", "\uC778\uCC9C\uC2DC\uCCAD", "\uC11D\uCC9C\uC0AC\uAC70\uB9AC", "\uBAA8\uB798\uB0B4\uC2DC\uC7A5", "\uB9CC\uC218", "\uB0A8\uB3D9\uAD6C\uCCAD", "\uC778\uCC9C\uB300\uACF5\uC6D0", "\uC6B4\uC5F0"].map((name, i) => ({ id: 15e3 + i, name }))
  },
  "gyeongchun": {
    name: "\uACBD\uCD98",
    label: "\uACBD\uCD98\uC120",
    color: "#0C8E72",
    stations: ["\uCCAD\uB7C9\uB9AC", "\uD68C\uAE30", "\uC911\uB791", "\uC0C1\uBD09", "\uB9DD\uC6B0", "\uC2E0\uB0B4", "\uAC08\uB9E4", "\uBCC4\uB0B4", "\uD1F4\uACC4\uC6D0", "\uC0AC\uB989", "\uAE08\uACE1", "\uD3C9\uB0B4\uD638\uD3C9", "\uCC9C\uB9C8\uC0B0", "\uB9C8\uC11D", "\uB300\uC131\uB9AC", "\uCCAD\uD3C9", "\uC0C1\uCC9C", "\uAC00\uD3C9", "\uAD74\uBD09\uC0B0", "\uBC31\uC591\uB9AC", "\uAC15\uCD0C", "\uAE40\uC720\uC815", "\uB0A8\uCD98\uCC9C", "\uCD98\uCC9C"].map((name, i) => ({ id: 16e3 + i, name }))
  },
  "seohae": {
    name: "\uC11C\uD574",
    label: "\uC11C\uD574\uC120",
    color: "#8FC31F",
    stations: ["\uC77C\uC0B0", "\uD48D\uC0B0", "\uBC31\uB9C8", "\uACE1\uC0B0", "\uB300\uACE1", "\uB2A5\uACE1", "\uAE40\uD3EC\uACF5\uD56D", "\uC6D0\uC885", "\uBD80\uCC9C\uC885\uD569\uC6B4\uB3D9\uC7A5", "\uC18C\uC0AC", "\uC18C\uC0C8\uC6B8", "\uC2DC\uD765\uB300\uC57C", "\uC2E0\uCC9C", "\uC2E0\uD604", "\uC2DC\uD765\uC2DC\uCCAD", "\uC2DC\uD765\uB2A5\uACE1", "\uB2EC\uBBF8", "\uC120\uBD80", "\uCD08\uC9C0", "\uC2DC\uC6B0", "\uC6D0\uC2DC"].map((name, i) => ({ id: 17e3 + i, name }))
  },
  "sillim": {
    name: "\uC2E0\uB9BC",
    label: "\uC2E0\uB9BC\uC120",
    color: "#6789CA",
    stations: ["\uC0DB\uAC15", "\uB300\uBC29", "\uC11C\uC6B8\uC9C0\uBC29\uBCD1\uBB34\uCCAD", "\uBCF4\uB77C\uB9E4", "\uBCF4\uB77C\uB9E4\uACF5\uC6D0", "\uBCF4\uB77C\uB9E4\uBCD1\uC6D0", "\uB2F9\uACE1", "\uC2E0\uB9BC", "\uC11C\uC6D0", "\uC11C\uC6B8\uB300\uBCA4\uCC98\uD0C0\uC6B4", "\uAD00\uC545\uC0B0"].map((name, i) => ({ id: 18e3 + i, name }))
  },
  "uisinseol": {
    name: "\uC6B0\uC774\uC2E0\uC124",
    label: "\uC6B0\uC774\uC2E0\uC124\uC120",
    color: "#B0CE18",
    stations: ["\uBD81\uD55C\uC0B0\uC6B0\uC774", "\uC194\uBC2D\uACF5\uC6D0", "4.19\uBBFC\uC8FC\uBB18\uC9C0", "\uAC00\uC624\uB9AC", "\uD654\uACC4", "\uC0BC\uC591", "\uC0BC\uC591\uC0AC\uAC70\uB9AC", "\uC194\uC0D8", "\uBD81\uD55C\uC0B0\uBCF4\uAD6D\uBB38", "\uC815\uB989", "\uC131\uC2E0\uC5EC\uB300\uC785\uAD6C", "\uBCF4\uBB38", "\uC2E0\uC124\uB3D9"].map((name, i) => ({ id: 19e3 + i, name }))
  },
  "gimpo": {
    name: "\uAE40\uD3EC\uACE8\uB4DC",
    label: "\uAE40\uD3EC\uACE8\uB4DC\uB77C\uC778",
    color: "#AD8605",
    stations: ["\uC591\uCD0C", "\uAD6C\uB798", "\uB9C8\uC0B0", "\uC7A5\uAE30", "\uC6B4\uC591", "\uAC78\uD3EC\uBD81\uBCC0", "\uC0AC\uC6B0(\uAE40\uD3EC\uC2DC\uCCAD)", "\uD48D\uBB34", "\uACE0\uCD0C", "\uAE40\uD3EC\uACF5\uD56D"].map((name, i) => ({ id: 2e4 + i, name }))
  },
  "everline": {
    name: "\uC5D0\uBC84\uB77C\uC778",
    label: "\uC6A9\uC778\uACBD\uC804\uCCA0",
    color: "#56C6A5",
    stations: ["\uAE30\uD765", "\uAC15\uB0A8\uB300", "\uC9C0\uC11D", "\uC5B4\uC815", "\uB3D9\uBC31", "\uCD08\uB2F9", "\uC0BC\uAC00", "\uC2DC\uCCAD\xB7\uC6A9\uC778\uB300", "\uBA85\uC9C0\uB300", "\uAE40\uB7C9\uC7A5", "\uC6B4\uB3D9\uC7A5\xB7\uC1A1\uB2F4\uB300", "\uACE0\uC9C4", "\uBCF4\uD3C9", "\uB454\uC804", "\uC804\uB300\xB7\uC5D0\uBC84\uB79C\uB4DC"].map((name, i) => ({ id: 21e3 + i, name }))
  },
  "uijeongbu": {
    name: "\uC758\uC815\uBD80",
    label: "\uC758\uC815\uBD80\uACBD\uC804\uCCA0",
    color: "#FDA600",
    stations: ["\uBC1C\uACE1", "\uD68C\uB8E1", "\uBC94\uACE8", "\uACBD\uC804\uCCA0\uC758\uC815\uBD80", "\uC758\uC815\uBD80\uC2DC\uCCAD", "\uD765\uC120", "\uC758\uC815\uBD80\uC911\uC559", "\uB3D9\uC624", "\uC0C8\uB9D0", "\uACBD\uAE30\uB3C4\uCCAD\uBD81\uBD80\uCCAD\uC0AC", "\uD6A8\uC790", "\uACE4\uC81C", "\uC5B4\uB8E1", "\uC1A1\uC0B0", "\uD0D1\uC11D", "\uCC28\uB7C9\uAE30\uC9C0\uC784\uC2DC\uC5ED"].map((name, i) => ({ id: 22e3 + i, name }))
  },
  "gyeonggang": {
    name: "\uACBD\uAC15",
    label: "\uACBD\uAC15\uC120",
    color: "#003DA5",
    stations: ["\uD310\uAD50", "\uC131\uB0A8", "\uC774\uB9E4", "\uC0BC\uB3D9", "\uACBD\uAE30\uAD11\uC8FC", "\uCD08\uC6D4", "\uACE4\uC9C0\uC554", "\uC2E0\uB454\uB3C4\uC608\uCD0C", "\uC774\uCC9C", "\uBD80\uBC1C", "\uC138\uC885\uB300\uC655\uB989", "\uC5EC\uC8FC"].map((name, i) => ({ id: 23e3 + i, name }))
  },
  "gtxa": {
    name: "GTX-A",
    label: "GTX-A",
    color: "#9A6292",
    stations: ["\uC218\uC11C", "\uC131\uB0A8", "\uAD6C\uC131", "\uB3D9\uD0C4"].map((name, i) => ({ id: 24e3 + i, name }))
  }
};
var linesData = Object.fromEntries(
  Object.entries(baseLinesData).map(([key, data]) => [
    key,
    {
      ...data,
      stations: data.stations.map((st) => {
        const hasInside = st.id % 2 === 0;
        const hasOutside = st.id % 3 === 0;
        let restroom = "none";
        if (hasInside && hasOutside) restroom = "both";
        else if (hasInside) restroom = "inside";
        else if (hasOutside) restroom = "outside";
        else restroom = "inside";
        const car = st.id % 10 + 1;
        const door = st.id % 4 + 1;
        return {
          ...st,
          restroom,
          fastestExit: `${car}-${door}`
        };
      })
    }
  ])
);

// src/utils/pathfinder.js
function buildGraph() {
  const graph = {};
  Object.keys(linesData).forEach((lineKey) => {
    const stations = linesData[lineKey].stations;
    for (let i = 0; i < stations.length; i++) {
      const currentStation = stations[i].name;
      const nodeId = `${lineKey}_${currentStation}`;
      if (!graph[nodeId]) graph[nodeId] = [];
      if (i < stations.length - 1) {
        const nextStation = stations[i + 1].name;
        const weight = lineKey.includes("-express") ? 3 : 2;
        graph[nodeId].push({ target: `${lineKey}_${nextStation}`, weight, type: "move" });
      }
      if (i > 0) {
        const prevStation = stations[i - 1].name;
        const weight = lineKey.includes("-express") ? 3 : 2;
        graph[nodeId].push({ target: `${lineKey}_${prevStation}`, weight, type: "move" });
      }
    }
  });
  const stationNameToLines = {};
  Object.keys(linesData).forEach((lineKey) => {
    linesData[lineKey].stations.forEach((st) => {
      if (!stationNameToLines[st.name]) {
        stationNameToLines[st.name] = [];
      }
      stationNameToLines[st.name].push(lineKey);
    });
  });
  Object.keys(stationNameToLines).forEach((stationName) => {
    const lines = stationNameToLines[stationName];
    if (lines.length > 1) {
      for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines.length; j++) {
          if (i !== j) {
            const fromNode = `${lines[i]}_${stationName}`;
            const toNode = `${lines[j]}_${stationName}`;
            let weight = 5;
            const isSameLineGroup = (l1, l2) => {
              if (l1.startsWith("1") && l2.startsWith("1") && !l1.includes("incheon") && !l2.includes("incheon")) return true;
              if (l1.startsWith("4") && l2.startsWith("4")) return true;
              if (l1.startsWith("9") && l2.startsWith("9")) return true;
              if (l1.startsWith("suin") && l2.startsWith("suin")) return true;
              if (l1.startsWith("gyeongui") && l2.startsWith("gyeongui")) return true;
              return false;
            };
            if (isSameLineGroup(lines[i], lines[j])) {
              weight = 0;
            }
            graph[fromNode].push({ target: toNode, weight, type: "transfer" });
          }
        }
      }
    }
  });
  return graph;
}
var subwayGraph = buildGraph();
function findShortestPath(startLine, startStation, endLine, endStation) {
  const startNode = `${startLine}_${startStation}`;
  const endNode = `${endLine}_${endStation}`;
  if (!subwayGraph[startNode] || !subwayGraph[endNode]) {
    return null;
  }
  const distances = {};
  const previous = {};
  const unvisited = new Set(Object.keys(subwayGraph));
  Object.keys(subwayGraph).forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[startNode] = 0;
  while (unvisited.size > 0) {
    let currentNode = null;
    let minDistance = Infinity;
    unvisited.forEach((node) => {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        currentNode = node;
      }
    });
    if (currentNode === null || distances[currentNode] === Infinity) {
      break;
    }
    if (currentNode === endNode) {
      break;
    }
    unvisited.delete(currentNode);
    subwayGraph[currentNode].forEach((neighbor) => {
      if (unvisited.has(neighbor.target)) {
        const newDist = distances[currentNode] + neighbor.weight;
        if (newDist < distances[neighbor.target]) {
          distances[neighbor.target] = newDist;
          previous[neighbor.target] = { node: currentNode, type: neighbor.type };
        }
      }
    });
  }
  const path = [];
  let curr = endNode;
  if (previous[curr] !== void 0 || curr === startNode) {
    while (curr !== null) {
      const line = curr.split("_")[0];
      const station = curr.split("_")[1];
      const prevData = previous[curr];
      path.unshift({
        lineKey: line,
        stationName: station,
        lineName: linesData[line].label,
        type: prevData ? prevData.type : "start"
      });
      curr = prevData ? prevData.node : null;
    }
  }
  const transfers = path.filter((p) => p.type === "transfer").map((p) => {
    let hash = 0;
    for (let i = 0; i < p.stationName.length; i++) {
      hash = p.stationName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const escCar = Math.abs(hash % 10) + 1;
    const escDoor = Math.abs(hash * 3 % 4) + 1;
    const evCar = Math.abs(hash * 7 % 10) + 1;
    const evDoor = Math.abs(hash * 11 % 4) + 1;
    const targetStation = linesData[p.lineKey].stations.find((s) => s.name === p.stationName);
    const restroom = targetStation ? targetStation.restroom : "unknown";
    return {
      station: p.stationName,
      toLine: p.lineName,
      toColor: linesData[p.lineKey].color,
      restroom,
      fastTransfer: {
        escalator: `${escCar}-${escDoor}`,
        elevator: `${evCar}-${evDoor}`
      }
    };
  });
  return {
    path,
    transfers,
    totalTime: distances[endNode],
    // 분 단위
    startStation,
    endStation,
    startLineName: linesData[startLine].label,
    endLineName: linesData[endLine].label
  };
}
