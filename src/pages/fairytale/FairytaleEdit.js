import React from "react";
import { useRecoilValue } from "recoil";
import {
  WrittenStoryState,
  GeneratedStoryState,
  SelectedKeywords,
} from "../../recoil/Fairytailstate";

function FairytaleEdit() {
  const writtenStory = useRecoilValue(WrittenStoryState);
  const generatedStory = useRecoilValue(GeneratedStoryState);
  const selectedKeywords = useRecoilValue(SelectedKeywords);

  return (
    <div>
      <h1>whw</h1>
      <ul>
        <li>{writtenStory.text}</li>
        <li>{generatedStory.text}</li>
        {/* <li>{selectedKeywords.text}</li> */}
      </ul>
    </div>
  );
}

export default FairytaleEdit;
