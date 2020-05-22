<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
:root {
  --teal-hex: #2ec4b6;
  --light-teal-hex: #a0e4dd;
  --white-hex: #ffffff;
}
html,
body {
  margin: 0px;
  padding: 0px;
  position: relative;
  cursor: default;
  font-family: 'Quicksand';
}
html {
  min-height: 100%;
}
* {
  outline: 0;
}
/******************************* */
.loading {
  position: absolute;
  z-index: 10001;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
/********************************* */
button {
  color: var(--white-hex);
  background: var(--teal-hex);
  border: 0;
  border-radius: 20px;
  font-size: 18px;
  cursor: pointer;
  padding: 10px 50px;
}
button:hover {
  background: var(--light-teal-hex);
}
button.reverse {
  background: var(--light-teal-hex);
}
button.reverse:hover {
  background: var(--teal-hex);
}
</style>
