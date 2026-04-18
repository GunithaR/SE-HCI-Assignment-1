//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {

        String str = "Hello, World!";
        int count = 0;
        for (int i = 0; i < str.length(); i++) {
            if ((str.indexOf(i)== 'a') || str.indexOf(i) || str[i]==("i") || str[i]==("o") || str[i]==("u")) {
                count++;
            }
        }
        System.out.println("Number of vowels in the string: " + count);
}