import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'

export default defineConfig({
  input: {
    path: './swagger.yaml',
  },
  output: {
    path: '.',
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: {
        path: './src/gen/types',
      },
    }),
    pluginReactQuery({
      output: {
        path: '../web/hooks',
      },
      group: {
        type: 'tag',
        name: ({ group }) => `${group}Hooks`,
      },
      client: {
        dataReturnType: 'full',
        baseURL: 'http://localhost:3001'
      },
      mutation: {
        methods: [ 'post', 'put', 'delete', 'patch' ],
      },
      infinite: {
        queryParam: 'next_page',
        initialPageParam: 0,
        cursorParam: 'nextCursor',
      },
      query: {
        methods: [ 'get' ],
        importPath: "@tanstack/react-query"
      },
      suspense: {},
    }),
  ],
})