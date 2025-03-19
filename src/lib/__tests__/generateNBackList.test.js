import { assert } from "chai";

import { generateNBackStimuli } from "../generateNBackList";

describe("generate n back stimuli", function () {
  it("n back 0", function () {
    const result = generateNBackStimuli(30, 10,0)
    const stimuli = result.list.map((item) => item[0]);
    const xCount = stimuli.filter(l => l === "X").length;
    assert.equal(xCount, 10)
    assert.equal(xCount, result.targetCount)
  });

  it("n back 1", function () {
    const nBack = 1

    const result1 = generateNBackStimuli(30, 10,nBack)
    const targetCount1 = result1.list.filter(l => l[1] === 1).length;
    for (let i = 0; i < result1.list.length; i++){
      const letter = result1.list[i][0]
      const targetFlag = result1.list[i][1]
      if (targetFlag === 1){
        assert.equal(result1.list[i-nBack][0], letter)
      }
    }
    assert.equal(targetCount1, 10)
    assert.equal(targetCount1, result1.targetCount)

    const result2 = generateNBackStimuli(50, 25,1)

    const targetCount2 = result2.list.filter(l => l[1] === 1).length;
    for (let i = 0; i < result2.list.length; i++){
      const letter = result2.list[i][0]
      const targetFlag = result2.list[i][1]
      if (targetFlag === 1){
        assert.equal(result2.list[i-nBack][0], letter)
      }
    }
    assert.equal(targetCount2, 25)
    assert.equal(targetCount2, result2.targetCount)
  });

  it("n back 2", function () {
    const nBack = 2
    const result1 = generateNBackStimuli(50, 20,nBack)
    const targetCount1 = result1.list.filter(l => l[1] === 1).length;
    for (let i = 0; i < result1.list.length; i++){
      const letter = result1.list[i][0]
      const targetFlag = result1.list[i][1]
      if (targetFlag === 1){
        assert.equal(result1.list[i-nBack][0], letter)
      }
    }
    assert.equal(targetCount1, 20)
    assert.equal(targetCount1, result1.targetCount)
  });

});
