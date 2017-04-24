function ContainerViewModel(data) {
  this.Id = data.Id;
  this.Status = data.Status;
  this.State = data.State;
  this.Names = data.Names;
  // Unavailable in Docker < 1.10
  if (data.NetworkSettings && !_.isEmpty(data.NetworkSettings.Networks)) {
    this.IP = data.NetworkSettings.Networks[Object.keys(data.NetworkSettings.Networks)[0]].IPAddress;
  }
  this.Image = data.Image;
  this.Command = data.Command;
  this.Checked = false;
  this.Labels = data.Labels;
  this.Ports = [];
  this.Mounts = data.Mounts;
  for (var i = 0; i < data.Ports.length; ++i) {
    var p = data.Ports[i];
    if (p.PublicPort) {
      this.Ports.push({ host: p.IP, private: p.PrivatePort, public: p.PublicPort });
    }
  }
  if (data.Whale) {
    this.Metadata = {};
    if (data.Whale.ResourceControl) {
      this.Metadata.ResourceControl = {
        OwnerId: data.Whale.ResourceControl.OwnerId
      };
    }
  }
}
