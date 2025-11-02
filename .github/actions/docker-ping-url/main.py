import time
import requests
import environment


if __name__ == "__main__":
    print("Hello world")

    def ping_url(url, delay, max_trials):
      trials = 0
      while trials < max_trials:
          response = requests.get(url)
          if response.status_code == 200:
              return True
          time.sleep(delay)
          trials += 1
      return False


    def run():
        url = environment.get("INPUT_URL")
        delay = int(environment.get("INPUT_DELAY"))
        max_trials = int(environment.get("INPUT_MAX_TRIALS"))

        accessible = ping_url(url, delay, max_trials)
        if accessible:
            print(f"The URL {url} is accessible.")
        else:
            raise Exception(f"The URL {url} is not accessible after {max_trials} trials.")

    run()
