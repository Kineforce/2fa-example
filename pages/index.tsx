import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const inputs = Array.from(Array(6).keys())
  const [values, setValues] = useState(inputs.map(() => ''))
  const inputElement = useRef(null);

  useEffect(() => {
    if (inputElement.current) {
      (inputElement.current as any).focus();
    }
  }, []);

  const onKeyPress = (e: any) => {
    const allowedKeys = [
      ...Array.from(Array(10).keys()).map((i) => i.toString()),
      'Backspace',
      'Delete',
      'Tab',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
    ]

    if (!allowedKeys.includes(e.key)) {
      e.preventDefault()
      return;
    }

    const { key, target } = e
    const { name } = target
    const index = parseInt(name)

    const getUpdatedValues = (key: string, index: number) =>
      values.map((value, i) => (i === index ? key : value))

    const utility = (key: string) => {
      const utilityKeys: Record<string, number> = {
        Enter: 1,
        Backspace: -1,
        ArrowRight: 1,
        ArrowLeft: -1,
      }

      if (!(key in utilityKeys)) return false;

      if (key === 'Backspace') setValues(getUpdatedValues('', index))

      const newIndex = index + utilityKeys[key]
      newIndex >= 0
        && newIndex < inputs.length
        && document.getElementsByName(`${newIndex}`)[0].focus()
    }

    const number = (key: string) => {
      if (isNaN(parseInt(key))) return false;

      setValues(getUpdatedValues(key, index))

      index < inputs.length - 1
        && document.getElementsByName((index + 1).toString())[0].focus()
    }

    utility(key) || number(key)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>2FA Example by Pablo Jonatan</title>
        <meta name="description" content="2FA Example by @pjonatansr" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '75vh' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {
            inputs.map((_, index) => (
              <input
                key={index}
                style={{ width: 50, height: 50, fontSize: 30, textAlign: 'center', margin: 10 }}
                type="text"
                maxLength={1}
                onKeyDown={onKeyPress}
                name={index.toString()}
                className={values[index] === '' ? styles.invalid : ''}
                value={values[index]}
                ref={index === 0 ? inputElement : null}
              />
            ))
          }
        </div>
        <p style={{ color: 'red', fontSize: 20, fontWeight: 'bold' }}>{values.join('').length !== 6 && 'O código deve ter 6 dígitos'}</p>
      </main>

      <footer tabIndex={-1} className={styles.footer}>
        <a
          style={{ color: 'turquoise', fontSize: 20, fontWeight: 'bold' }}
          tabIndex={-1} href="https://twitter.com/pjonatansr" target="_blank" rel="noopener noreferrer">
          @pjonatansr
        </a>

        <a
          style={{ color: 'turquoise', fontSize: 20, fontWeight: 'bold' }}
          tabIndex={-1} href="https://github.com/pjonatansr/2fa-example" target="_blank" rel="noopener noreferrer">
          Github
        </a>
      </footer>
    </div >
  )
}
