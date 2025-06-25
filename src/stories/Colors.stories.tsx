import type { Meta, StoryObj } from "@storybook/react";
import { Colors } from "./Colors";

const meta: Meta = {
  title: "Design System",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj;

export const CheckureeColors: Story = {
  render: () => (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {Colors.map((group) => (
        <div key={group.category} style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "16px", fontSize: "18px" }}>
            {group.category}
          </h2>
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {group.colors.map((color) => (
              <div
                key={color.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: color.hex,
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginBottom: "8px",
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "14px" }}>{color.name}</p>
                  <code style={{ fontSize: "12px", color: "#666" }}>
                    {color.hex}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
