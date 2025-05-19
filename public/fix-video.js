const fixScreenShare = () => {
  // Fix screen sharing
  const videoSection = document.querySelector("#root");
  if (videoSection) {
    videoSection.click();
    console.log("Clicked to force video activation");
  }
}

// Run immediately and then periodically
fixScreenShare();
setInterval(fixScreenShare, 2000);
