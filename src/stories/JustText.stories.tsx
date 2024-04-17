import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const JustText = () => "Just text";

const meta = {
  title: "Example/JustText",
  component: JustText,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof JustText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
