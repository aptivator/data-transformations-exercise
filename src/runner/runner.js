export function runPipeline(pipeline, data) {
  for(let {elementId, operation} of pipeline) {
    let el = document.getElementById(elementId);
    data = operation(data);
    el.innerHTML = JSON.stringify(data, null, 2);
  }
}
