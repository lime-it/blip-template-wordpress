import {expect, test} from '@oclif/test'

describe('template-wordpress:extract', () => {
  test
  .stdout()
  .command(['template-wordpress:extract'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['template-wordpress:extract', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
