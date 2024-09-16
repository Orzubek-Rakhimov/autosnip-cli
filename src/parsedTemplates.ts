export enum ParsedTemplates {
  "TRAFC" = `import React from 'react';

interface Props {}

const {{name}} = ({}: Props) => {
  return (
    <div>
      {{name}}
    </div>
  );
};

export default {{name}};`,
  "TRFC" = `import React from 'react';

interface Props {}

function {{name}}({}: Props) {
  return (
    <div>
      {{name}}
    </div>
  );
}

export default {{name}};`,
  "TNAFC" = `import { View, Text } from 'react-native';

interface Props {}

const {{name}} = ({}: Props) => {
  return (
    <View>
      <Text>{{name}}</Text>
    </View>
  );
};

export default {{name}};`,
  "TNFC" = `import { View, Text } from 'react-native';

interface Props {}

const {{name}} = ({}: Props) => {
  return (
    <View>
      <Text>{{name}}</Text>
    </View>
  );
};

export default {{name}};`,
  "TXL" = `export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {children}
    </main>
  );
}`,
  "JRAFC" = `import React from 'react';

const {{name}} = () => {
  return (
    <div>
      {{name}}
    </div>
  );
};

export default {{name}};`,
  "JRFC" = `import React from 'react';


function {{name}}() {
  return (
    <div>
      {{name}}
    </div>
  );
}

export default {{name}};`,
  "JNAFC" = `import { View, Text } from 'react-native';

const {{name}} = () => {
  return (
    <View>
      <Text>{{name}}</Text>
    </View>
  );
};

export default {{name}};`,
  "JNFC" = `import { View, Text } from 'react-native';

function {{name}}() {
  return (
    <View>
      <Text>{{name}}</Text>
    </View>
  );
}

export default {{name}};`,
  "JXL" = `export default function RootLayout({ children }) {
  return (
    <main>
      {children}
    </main>
  );
}`
}