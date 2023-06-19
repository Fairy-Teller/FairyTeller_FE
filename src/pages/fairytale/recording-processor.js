class RecordingProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    // 오디오 처리 로직을 여기에 작성합니다.
    // ...
    return true;
  }
}

registerProcessor("recording-processor", RecordingProcessor);
