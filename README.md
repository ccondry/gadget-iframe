# gadget-iframe
A simple iframe gadget for Cisco Finesse. Accepts URL parameter 'url' in the
gadget layout XML to display a configurable iframe pointing at the chosen URL.

This was designed for Finesse 11.5, but may also work with earlier versions.

## Usage
Upload the 'iframe' folder to your Finesse 3rdpartygadget folder (under 'files'), and then update
your Finesse gadget layout XML to include the iframe gadget in a new or existing
tab. For example:

```
<tab>
  <id>iframe</id>
  <label>iframe</label>
  <gadgets>
    <gadget>/3rdpartygadget/files/iframe/gadget.xml?url=https://www.youtube.com/embed/owsfdh4gxyc&height=800&width=1024</gadget>
  </gadgets>
</tab>
```

The height and width parameters are optional values referring to the number of
pixels in size that you want the iframe. If not set, the gadget uses default
values of 800 for height and 'max' for width, which sets the gadget
width to 100% with CSS.
