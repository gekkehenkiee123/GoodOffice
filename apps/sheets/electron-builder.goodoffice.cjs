/** Unsigned, offline-first macOS packaging for the GoodOffice Sheets app. */
module.exports = {
  appId: 'org.goodoffice.spreadsheet',
  productName: 'GoodOffice',
  directories: {
    output: '../../release-goodoffice',
  },
  files: ['out/**'],
  extraResources: [
    {
      from: 'native/xlsx-engine/target/release/xlsx-sidecar',
      to: 'native/xlsx-sidecar',
    },
  ],
  mac: {
    category: 'public.app-category.productivity',
    target: [
      { target: 'dmg', arch: ['arm64', 'x64'] },
      { target: 'zip', arch: ['arm64', 'x64'] },
    ],
    identity: null,
    hardenedRuntime: false,
    gatekeeperAssess: false,
    notarize: false,
  },
  dmg: {
    title: 'GoodOffice',
    sign: false,
  },
  artifactName: 'GoodOffice-${version}-${arch}.${ext}',
  npmRebuild: false,
};
