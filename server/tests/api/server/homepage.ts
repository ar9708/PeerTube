/* eslint-disable @typescript-eslint/no-unused-expressions,@typescript-eslint/require-await */

import 'mocha'
import * as chai from 'chai'
import { HttpStatusCode } from '@shared/core-utils'
import { ServerConfig } from '@shared/models'
import {
  cleanupTests,
  CustomPagesCommand,
  flushAndRunServer,
  getConfig,
  killallServers,
  reRunServer,
  ServerInfo,
  setAccessTokensToServers
} from '../../../../shared/extra-utils/index'

const expect = chai.expect

async function getHomepageState (server: ServerInfo) {
  const res = await getConfig(server.url)

  const config = res.body as ServerConfig
  return config.homepage.enabled
}

describe('Test instance homepage actions', function () {
  let server: ServerInfo
  let command: CustomPagesCommand

  before(async function () {
    this.timeout(30000)

    server = await flushAndRunServer(1)
    await setAccessTokensToServers([ server ])

    command = server.customPageCommand
  })

  it('Should not have a homepage', async function () {
    const state = await getHomepageState(server)
    expect(state).to.be.false

    await command.getInstanceHomepage({ expectedStatus: HttpStatusCode.NOT_FOUND_404 })
  })

  it('Should set a homepage', async function () {
    await command.updateInstanceHomepage({ content: '<picsou-magazine></picsou-magazine>' })

    const page = await command.getInstanceHomepage()
    expect(page.content).to.equal('<picsou-magazine></picsou-magazine>')

    const state = await getHomepageState(server)
    expect(state).to.be.true
  })

  it('Should have the same homepage after a restart', async function () {
    this.timeout(30000)

    killallServers([ server ])

    await reRunServer(server)

    const page = await command.getInstanceHomepage()
    expect(page.content).to.equal('<picsou-magazine></picsou-magazine>')

    const state = await getHomepageState(server)
    expect(state).to.be.true
  })

  it('Should empty the homepage', async function () {
    await command.updateInstanceHomepage({ content: '' })

    const page = await command.getInstanceHomepage()
    expect(page.content).to.be.empty

    const state = await getHomepageState(server)
    expect(state).to.be.false
  })

  after(async function () {
    await cleanupTests([ server ])
  })
})
